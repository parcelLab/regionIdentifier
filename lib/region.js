// libs

const Country = require('countryjs');
const request = require('request');

// support countries

const availableCountries = 'DEU AUT BEL FRA ITA CHE ESP NLD GBR USA RUS CAN MEX'.split(' ');

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
    var ci = countryInfo.trim();
    var c;

    if (ci.toUpperCase() === 'THE UNITED STATES OF AMERICA') ci = 'USA';
    if (ci.toUpperCase() === 'AMERICA') ci = 'USA';

    if (ci.length === 3) {
      try {
        c = Country.ISOcodes(ci, 'ISO3');
      } catch (e) {
        return null;
      }
    } else if (ci.length === 2) {
      try {
        c = Country.ISOcodes(ci);
      } catch (e) {
        return null;
      }
    } else {
      try {
        c = Country.ISOcodes(ci, 'name');
      } catch (g) {
        return null;
      }
    }

    if (c) return c;
    else return null;
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
    case 'GBR':
      return zip.replace(/[0-9]/g, ' ').split(' ')[0].toUpperCase();

    case 'CAN':
      return zip.charAt(0) === 'X' ? zip.substring(0, 3) : zip.substring(0, 1);

    case 'NLD':
      return zip.split(' ')[0];

    case 'MEX':
      return zip.substring(0, 2);

    default:
      return zip;
  }
}

///////////////////
// The main part //
///////////////////

var regionIdentifier = function (apikey) {
  if (!apikey || apikey === '') throw Error('No valid Google Maps API key defined');

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
    console.log(countryIso);
    if (!countryIso) return callback('Could not resolve country information.', null, false);

    var zip = validateZipCode(countryIso.alpha3, zipCode);

    var region = null;

    // for countries with fixed mapping
    if (availableCountries.indexOf(countryIso.alpha3) > -1) {
      var zipCodeToRegionMappings = require('../regions/' + countryIso.alpha3);

      for (var i = 0; i < zipCodeToRegionMappings.length; i++) {
        var m = zipCodeToRegionMappings[i];

        if (m.list && m.list.indexOf(parseInt(zip)) > -1) {
          region = m.region;
          break;
        }
        else if (!m.high && zip === m.low) region = m.region;
        else if (parseInt(zip) >= m.low && parseInt(zip) <= m.high) region = m.region;

        if (region) break;
      }
    }

    if (!region && !zip) return this.detectWithGoogle(countryIso, zipCode, callback);
    if (!region) return callback(null, null, false);
    return callback(null, region, false);
  };

  this.getNameFromCountryAndRegion = function (country, region) {
    if (!country || !region) return null;

    const countryIso = resolveCountryToISO3(country);
    if (!countryIso) return null;

    try {
      var name = require('../regionNames/' + countryIso.alpha3)[region];
      if (!name) return null;
      else return name;

    } catch (e) {
      return null;
    }
  };

  this.detectWithGoogle = function (countryIso, zipCode, callback) {
    var param = 'country=' + countryIso.alpha3 + ' postal_code=' + zipCode;
    const googleLink = 'https://maps.googleapis.com/maps/api/geocode/json' +
      '?key=' + this.apikey +
      '&address=####&sensor=true';
    request.get(googleLink.replace('####', encodeURIComponent(param)), function (err, res, body) {
      if (err || !body) return callback(err, null, true);
      var data = {
        results: [],
      };
      try {
        data = JSON.parse(body);
      } catch (e) { }

      if (data.results.length <= 0) return callback(null, null, true);

      //find country inside of the nestled array.
      var region = data.results[0].address_components.filter(function (component) {
        var typeFound = component.types.filter(function (type) {
          return type === 'administrative_area_level_1';
        })[0];

        return typeFound && typeFound.length > 0;
      })[0];

      if (!region) return callback('NOT FOUND', null, true);
      var result = countryIso.alpha2 + '-' + region.short_name.toUpperCase().replace('.', '');
      callback(null, result, true);
    });
  };
};

module.exports = regionIdentifier;
