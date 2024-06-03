const Country = require('countryjs');

const availableCountries = new Set([
  'DEU',
  'AUT',
  'BEL',
  'FRA',
  'ITA',
  'USA',
  'ESP',
  'NLD',
  'GBR',
  'CAN',
]);

function validateZipCode(zip) {
  return zip.split(' ')[0];
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

  const validZip = validateZipCode(zipCode);

  if (availableCountries.has(countryIso.alpha3)) {
    const zipCodeToGeocode = require(`../geocode/${countryIso.alpha3}`);

    for (const i of zipCodeToGeocode) {
      if (i.zip === validZip) {
        return [i.longitude, i.latitude];
      }
    }
  }
}

module.exports = coordinates;
