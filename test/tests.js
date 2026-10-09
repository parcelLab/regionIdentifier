const { default: axios } = require('axios');
const { deepEqual, equal, rejects, match } = require('node:assert/strict');
const { describe, it } = require('node:test');

const { GoogleMapsAPIError } = require('../lib/errors');
const coordinates = require('../lib/geocode');
const RegionIdentifier = require('../lib/region');
const countriesPostalCodes = require('./fixtures/countries-postal-codes.json');

const identifier = new RegionIdentifier('<API KEY>');

function googleMapsResponse(regionShortName) {
  return {
    data: {
      results: [
        {
          address_components: [
            {
              short_name: regionShortName,
              types: ['administrative_area_level_1'],
            },
          ],
        },
      ],
    },
  };
}

async function withMockedGoogleGet(mockGet, callback) {
  const originalGet = axios.get;
  axios.get = mockGet;

  try {
    return await callback();
  } finally {
    axios.get = originalGet;
  }
}

describe('REGION IDENTIFIER', () => {
  Object.entries(countriesPostalCodes).forEach(([countryName, countryPostalCodes]) => {
    describe(`get() for ${countryName}`, () => {
      countryPostalCodes.forEach((test) => {
        it(`result for: ${test.name} with zip code: ${test.zip}`, async () => {
          const [region, googleUsed] = await identifier.get(test.name, test.zip);

          equal(region, test.result);
          equal(googleUsed, test.usingGoogle);
        });
      });
    });
  });
});

describe('Fallback and error handling', () => {
  it('preserves coordinate lookup results and misses', () => {
    deepEqual(coordinates('DEU', '01945'), ['14', '51.4333']);
    equal(coordinates('DEU', '00000'), undefined);
    equal(coordinates('QAT', '06000'), undefined);
  });

  it('returns null without Google Maps when static data has no matching zip code', async () => {
    const [region, googleUsed] = await withMockedGoogleGet(
      async () => {
        throw new Error('Google Maps should not be called for static misses');
      },
      () => identifier.get('DEU', '00000'),
    );

    equal(region, null);
    equal(googleUsed, false);
  });

  it('throws when country or zip code is missing', async () => {
    await rejects(() => identifier.get('', '12345'));
    await rejects(() => identifier.get('DEU', ''));
  });

  it('detects regions with Google Maps when called directly', async () => {
    const region = await withMockedGoogleGet(
      async (url) => {
        match(url, /maps\.googleapis\.com/);
        match(url, /country%3DQAT%20postal_code%3D06000/);
        return googleMapsResponse('DA');
      },
      () => identifier.detectWithGoogle({ alpha2: 'QA', alpha3: 'QAT' }, '06000'),
    );

    equal(region, 'QA-DA');
  });

  it('throws when country cannot be resolved', async () => {
    await rejects(() => identifier.get('Atlantis', '12345'));
  });

  it('normalizes British region names from Google Maps', async () => {
    for (const [name, code] of [
      ['England', 'ENG'],
      ['Northern Ireland', 'NIR'],
      ['Scotland', 'SCT'],
      ['Wales', 'WLS'],
    ]) {
      const region = await withMockedGoogleGet(
        async () => googleMapsResponse(name),
        () => identifier.detectWithGoogle({ alpha2: 'GB', alpha3: 'GBR' }, 'CF10'),
      );
      equal(region, `GB-${code}`);
    }
  });

  it('returns null for Google Maps responses without data or results', async () => {
    for (const response of [{}, { data: { results: [] } }]) {
      const region = await withMockedGoogleGet(
        async () => response,
        () => identifier.detectWithGoogle({ alpha2: 'QA', alpha3: 'QAT' }, '06000'),
      );
      equal(region, null);
    }
  });

  it('wraps Google Maps request failures', async () => {
    await withMockedGoogleGet(
      async () => {
        throw new Error('network unavailable');
      },
      async () => {
        await rejects(
          () => identifier.detectWithGoogle({ alpha2: 'QA', alpha3: 'QAT' }, '06000'),
          (err) => err instanceof GoogleMapsAPIError,
        );
      },
    );
  });

  it('throws when Google Maps response has no administrative region', async () => {
    await withMockedGoogleGet(
      async () => ({
        data: {
          results: [
            {
              address_components: [{ short_name: 'QA', types: ['country'] }],
            },
          ],
        },
      }),
      async () => {
        await rejects(
          () => identifier.detectWithGoogle({ alpha2: 'QA', alpha3: 'QAT' }, '06000'),
          (err) => err instanceof GoogleMapsAPIError,
        );
      },
    );
  });

  it('returns region display names', () => {
    equal(identifier.getNameFromCountryAndRegion('DEU', 'DE-TH'), 'Thüringen');
    equal(identifier.getNameFromCountryAndRegion('DEU', 'UNKNOWN'), null);
    equal(identifier.getNameFromCountryAndRegion('Atlantis', 'DE-TH'), null);
  });
});
