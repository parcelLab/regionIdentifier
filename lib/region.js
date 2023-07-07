const Country = require('countryjs');
const request = require('request');

// support countries
const availableCountries = new Set(['DEU', 'AUT', 'BEL', 'FRA', 'ITA', 'CHE', 'ESP', 'NLD', 'GBR', 'USA', 'RUS', 'CAN', 'MEX']);

//////////////////////
// Helper functions //
//////////////////////

/**
 * resolves a country definition as name, ISO alpha2 or alpha3 to ISO alpha3
 * @param  {String} countryInfo information about the country in any half-sensible format
 * @return {String}             ISO alpha3 code of the country
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
 * @param  {String} country country as ISO alpha3 code
 * @param  {String} zip     the zip code
 * @return {String}         the cleaned zip code
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
        (countryConfig.zipCodeFormat === 'numeric' ?
          regionMapping.list
            .some((l) => zip.startsWith(String(l).padStart(countryConfig.zipCodeLength, '0')))
          : false
        )
      )
    ) {
      return regionMapping.region;
    }
    else if (!regionMapping.high && zip === regionMapping.low) return regionMapping.region;
    else if (parseInt(zip) >= regionMapping.low && parseInt(zip) <= regionMapping.high) return regionMapping.region;
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

function regionIdentifier(apikey) {
  if (!apikey || apikey === '') throw new Error('No valid Google Maps API key defined');

  this.apikey = apikey;

  /**
   * gets the name region for a combination of country and zip with the static mappings, or if
   * these are not available with Google Maps Geocoding. The last argument of the callback()
   * indicates if Google has been used. Regions are returned as ISO 3166-2 code.
   * @param  {String}   country  information about the country in any half-sensible format
   * @param  {String}   zipCode  the zip code
   * @param  {Function} callback callback(err, region, hasUsedGoogle)
   */
  this.get = function (country, zipCode, callback) {
    if (!country || !zipCode) return callback('Country and zip code are required.', null, false);

    // prepare
    const countryIso = resolveCountryToISO3(country);
    if (!countryIso) return callback('Could not resolve country information.', null, false);

    const zip = validateZipCode(countryIso.alpha3, zipCode);

    const region = availableCountries.has(countryIso.alpha3) ? getRegionByZipCodeOnStaticFiles(countryIso, zip) : null;

    if (!region && !zip) return this.detectWithGoogle(countryIso, zipCode, callback);
    if (!region) return callback(null, null, false);
    return callback(null, region, false);
  };

  this.getNameFromCountryAndRegion = (country, region) => {
    if (!country || !region) return null;

    const countryIso = resolveCountryToISO3(country);
    if (!countryIso) return null;

    try {
      const name = require(`../regionNames/${countryIso.alpha3}`)[region];
      return name || null;
    } catch {
      return null;
    }
  };

  this.detectWithGoogle = function (countryIso, zipCode, callback) {
    const param = `country=${countryIso.alpha3} postal_code=${zipCode}`;
    const googleLink = 'https://maps.googleapis.com/maps/api/geocode/json' +
      '?key=' + this.apikey +
      '&address=####&sensor=true';

    request.get(googleLink.replace('####', encodeURIComponent(param)), (err, res, body) => {
      if (err || !body) return callback(err, null, true);

      let data = { results: [] };
      try {
        data = JSON.parse(body);
      } catch (error) {
        console.warn('JSON parse error', error);
      }

      if (data.results.length <= 0) return callback(null, null, true);

      //find country inside of the nestled array.
      const region = data.results[0].address_components.find((component) => {
        const typeFound = component.types.find((type) => type === 'administrative_area_level_1');
        return typeFound && typeFound.length > 0;
      });

      if (!region) return callback('NOT FOUND', null, true);
      const result = `${countryIso.alpha2}-${cleanAndCatchFaultyRegionName(region)}`;
      callback(null, result, true);
    });
  };
};

module.exports = regionIdentifier;
