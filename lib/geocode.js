const Country = require('@parcellab/countryjs');

const availableCountries = new Set([
  'AUS',
  'AUT',
  'BEL',
  'CAN',
  'CHE',
  'CZE',
  'DEU',
  'DNK',
  'ESP',
  'FIN',
  'FRA',
  'GBR',
  'HUN',
  'IRL',
  'ITA',
  'JPN',
  'KOR',
  'LTU',
  'LUX',
  'MEX',
  'NLD',
  'NOR',
  'POL',
  'PRT',
  'ROU',
  'SRB',
  'SVK',
  'SWE',
  'USA',
]);

function validateZipCode(zip, country) {
  switch (country) {
    case 'SVK': {
      return zip.trim().replace(/^(\d{3}) (\d{2})$/, '$1$2');
    }
    case 'SWE': {
      return /^\d{3} ?\d{2}$/.test(zip) ? zip.replace(' ', '') : undefined;
    }
    case 'HUN':
    case 'ROU': {
      return zip.trim();
    }
    case 'PRT': {
      return zip.trim().replace(/^(\d{4})[- ]?(\d{3})$/, '$1-$2');
    }
    case 'NLD': {
      return /^(\d{4})(?:\s*[a-z]{2})?$/i.exec(zip.trim())?.[1];
    }
    case 'LTU': {
      return /^(?:LT-)?(\d{5})$/i.exec(zip.trim())?.[1];
    }
    case 'JPN': {
      return /^\d{3}-?\d{4}$/.test(zip) ? zip.replace('-', '') : undefined;
    }
    case 'IRL': {
      const eircode = zip.trim().toUpperCase();
      return /^(?:[A-Z]\d{2}|D6W)(?: ?[0-9AC-FHKNPRTV-Y]{4})?$/.test(eircode)
        ? eircode.slice(0, 3)
        : undefined;
    }
    case 'GBR': {
      return zip
        .trim()
        .toUpperCase()
        .match(/^([A-Z]{1,2}\d[A-Z\d]?)(?:\s*\d[A-Z]{2})?$/)?.[1];
    }
    case 'AUS': {
      return /^\d{4}$/.test(zip.trim()) ? zip.trim() : undefined;
    }
    case 'CAN': {
      return zip
        .trim()
        .toUpperCase()
        .match(/^([ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])(?:\s?\d[ABCEGHJ-NPRSTV-Z]\d)?$/)?.[1];
    }
    case 'USA': {
      return /^(\d{5})(?:-?\d{4}| \d{4})?$/.exec(zip.trim())?.[1];
    }
    case 'MEX': {
      return /^\d{5}$/.test(zip.trim()) ? zip.trim() : undefined;
    }
    case 'POL': {
      return zip.trim().replace(/^(\d{2})[- ]?(\d{3})$/, '$1-$2');
    }
    case 'DNK': {
      return zip.trim().replace(/^DK-?/i, '');
    }
    case 'CZE': {
      return /^\d{3} ?\d{2}$/.test(zip.trim()) ? zip.trim().replace(' ', '') : undefined;
    }
    case 'NOR': {
      const postcode = zip.trim().replace(/^NO-/i, '');
      return /^\d{4}$/.test(postcode) ? postcode : undefined;
    }
    default: {
      return zip.split(' ', 1)[0];
    }
  }
}

/**
 * Resolves the ISO3 country code based on the provided country information.
 * @param {string} countryInfo The country information to resolve the ISO3 code for.
 * @returns {string|null} The ISO3 country code if resolved, otherwise null.
 */
function resolveCountryToISO3(countryInfo) {
  if (!countryInfo) {
    return null;
  }

  const ci = countryInfo.trim();
  let isoCode;

  if (ci.length === 3) {
    try {
      isoCode = Country.ISOcodes(ci, 'ISO3');
    } catch {
      return null;
    }
  } else if (ci.length === 2) {
    try {
      isoCode = Country.ISOcodes(ci);
    } catch {
      return null;
    }
  } else {
    try {
      isoCode = Country.ISOcodes(ci, 'name');
    } catch {
      return null;
    }
  }

  return isoCode || null;
}

/**
 * Retrieves the coordinates (longitude and latitude) for a given country and zip code.
 * @param {string} country The name of the country.
 * @param {string} zipCode The zip code.
 * @returns {number[]} An array containing the longitude and latitude.
 * @throws {Error} If country or zip code is missing.
 * @throws {Error} If country information cannot be resolved.
 */
function coordinates(country, zipCode) {
  if (!country || !zipCode) {
    throw new Error('Country and zip code are required.');
  }

  const countryIso = resolveCountryToISO3(country);
  if (!countryIso) {
    throw new Error('Could not resolve country information.');
  }

  if (!availableCountries.has(countryIso.alpha3)) {
    return;
  }

  const validZip = validateZipCode(zipCode, countryIso.alpha3);
  const zipCodeToGeocode = require(`../geocode/${countryIso.alpha3}`);

  for (const i of zipCodeToGeocode) {
    if (i.zip === validZip) {
      return [i.longitude, i.latitude];
    }
  }
}

module.exports = coordinates;
module.exports.availableCountries = Object.freeze([...availableCountries]);
