const { default: axios } = require('axios');
const Country = require('countryjs');

const { GoogleMapsAPIError } = require('./errors');

// supported countries
const availableCountries = new Set([
  'AUT',
  'BEL',
  'CAN',
  'CHE',
  'DEU',
  'ESP',
  'FIN',
  'FRA',
  'GBR',
  'ITA',
  'MEX',
  'NLD',
  'RUS',
  'SRB',
  'SWE',
  'USA',
  'AUS',
]);

//////////////////////
// Helper functions //
//////////////////////

/**
 * resolves a country definition as name, ISO alpha2 or alpha3 to ISO alpha3
 * @param {String} countryInfo information about the country in any half-sensible format
 * @return {String} ISO alpha3 code of the country
 */
function resolveCountryToISO3(countryInfo) {
  if (countryInfo) {
    let ci = countryInfo.trim();
    let c;

    if (ci.toUpperCase() === 'THE UNITED STATES OF AMERICA') ci = 'USA';
    if (ci.toUpperCase() === 'AMERICA') ci = 'USA';

    if (ci.length === 3) {
      try {
        c = Country.ISOcodes(ci, 'ISO3');
      } catch {
        return null;
      }
    } else if (ci.length === 2) {
      try {
        c = Country.ISOcodes(ci);
      } catch {
        return null;
      }
    } else {
      try {
        c = Country.ISOcodes(ci, 'name');
      } catch {
        return null;
      }
    }

    return c || null;
  } else return null;
}

/////////////////////////
// Zip code validators //
/////////////////////////

/**
 * validates and cleans zip codes so they can be parsed more robust
 * @param {String} country country as ISO alpha3 code
 * @param {String} zip the zip code
 * @return {String} the cleaned zip code
 */
function validateZipCode(country, zip) {
  switch (country) {
    case 'GBR': {
      return zip.replaceAll(/\d/g, ' ').split(' ')[0].toUpperCase();
    }

    case 'CAN': {
      return zip.startsWith('X') ? zip.slice(0, 3) : zip.slice(0, 1);
    }

    case 'NLD': {
      return zip.split(' ')[0];
    }

    case 'MEX': {
      return zip.slice(0, 2);
    }

    default: {
      return zip;
    }
  }
}

//////////////////////////////////////////////
// Search zip code on the static JSON files //
//////////////////////////////////////////////
function getRegionByZipCodeOnStaticFiles(countryIso, zip) {
  const zipCodeToRegionMappings = require(`../regions/${countryIso.alpha3}`);
  const countryConfig = require(`../country/${countryIso.alpha3}`);

  for (const regionMapping of zipCodeToRegionMappings) {
    if (
      regionMapping.list &&
      (regionMapping.list.includes(parseInt(zip)) ||
        (countryConfig.zipCodeFormat === 'numeric'
          ? regionMapping.list.some((l) =>
              zip.startsWith(
                String(l).padStart(countryConfig.zipCodeLength, '0'),
              ),
            )
          : false))
    ) {
      return regionMapping.region;
    } else if (!regionMapping.high && zip === regionMapping.low)
      return regionMapping.region;
    else if (
      parseInt(zip) >= regionMapping.low &&
      parseInt(zip) <= regionMapping.high
    )
      return regionMapping.region;
  }
}

function cleanAndCatchFaultyRegionName(region) {
  const parsedRegion = region.short_name.toUpperCase().replace('.', '');

  if (/england/i.test(parsedRegion)) return 'ENG';
  else if (/northern.*ireland/i.test(parsedRegion)) return 'NIR';
  else if (/scotland/i.test(parsedRegion)) return 'SCT';
  else if (/wales/i.test(parsedRegion)) return 'WLS';

  return parsedRegion;
}

///////////////////
// The main part //
///////////////////

class RegionIdentifier {
  /**
   * Represents a Region object.
   * @constructor
   * @param {string} apikey The Google Maps API key.
   * @throws {Error} Throws an error if no valid Google Maps API key is defined.
   */
  constructor(apikey) {
    if (!apikey || apikey === '') {
      throw new Error('No valid Google Maps API key defined');
    }

    this.apikey = apikey;
  }

  /**
   * gets the name region for a combination of country and zip with the static mappings, or if
   * these are not available with Google Maps API.
   * indicates if Google has been used. Regions are returned as ISO 3166-2 code.
   * @param {String} country information about the country in any half-sensible format
   * @param {String} zipCode the zip code
   * @return {Promise<Array>} [region, googleUsed] where region is the ISO 3166-2 code of the region and googleUsed indicates if Google Maps has been used
   */
  async get(country, zipCode) {
    if (!country || !zipCode) {
      throw new Error('Country and zip code are required.');
    }

    // prepare
    const countryIso = resolveCountryToISO3(country);

    if (!countryIso) {
      throw new Error('Could not resolve country information.');
    }

    const zip = validateZipCode(countryIso.alpha3, zipCode);

    const region = availableCountries.has(countryIso.alpha3)
      ? getRegionByZipCodeOnStaticFiles(countryIso, zip)
      : null;

    if (!region && !zip) {
      const googleMapsRes = await this.detectWithGoogle(countryIso, zipCode);
      return [googleMapsRes, true];
    }

    if (!region) {
      return [null, false];
    }

    return [region, false];
  }

  getNameFromCountryAndRegion(country, region) {
    if (!country || !region) {
      return null;
    }

    const countryIso = resolveCountryToISO3(country);
    if (!countryIso) {
      return null;
    }

    try {
      const name = require(`../regionNames/${countryIso.alpha3}`)[region];
      return name || null;
    } catch {
      return null;
    }
  }

  /**
   * Detects the region using the Google Maps Geocoding API.
   * @param {object} countryIso The ISO code of the country.
   * @param {string} zipCode The postal code of the region.
   * @returns {Promise<string|null>} The region code in the format "countryIso-alpha2-regionCode", or null if not found.
   * @throws {GoogleMapsAPIError} If the Google Maps API request fails or the region is not found.
   */
  async detectWithGoogle(countryIso, zipCode) {
    const param = `country=${countryIso.alpha3} postal_code=${zipCode}`;
    const googleLink =
      'https://maps.googleapis.com/maps/api/geocode/json' +
      '?key=' +
      this.apikey +
      '&address=####&sensor=true';

    let response;

    try {
      response = await axios.get(
        googleLink.replace('####', encodeURIComponent(param)),
      );
    } catch (err) {
      throw new GoogleMapsAPIError('Google Maps API request failed: ' + JSON.stringify(err));
    }

      if (!response?.data) {
        return null;
      }

      if (response.data?.results?.length <= 0) {
        return null;
      }

      // find country inside of the nested array
      const region = response.data.results[0].address_components.find((component) => {
        const typeFound = component.types.find(
          (type) => type === 'administrative_area_level_1',
        );
        return typeFound && typeFound.length > 0;
      });

      if (!region) {
        throw new GoogleMapsAPIError('NOT FOUND');
      }

      return `${countryIso.alpha2}-${cleanAndCatchFaultyRegionName(region)}`;
  }
}

module.exports = RegionIdentifier;
