const Country = require('countryjs');
const request = require('request');
const storagedRegions = 'DEU AUT BEL GBM FRA'.split(' ');

/**
 * takes unidentified country info and tries to get the ISO3 Code
 * @param  {String} countryInfo some text about the country
 * @return {string}             ISO3 code
 */
function resolveCountryToISO3(countryInfo) {
  if (countryInfo) {
    var ci = countryInfo.trim();
    var c;

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

var regionIdentifier = function (apikey) {
  if (!apikey || apikey === '') throw Error('No API KEy defined');

  this.apikey = apikey;
  this.get = function (country, zipCode, callback) {
    const zip = parseInt(zipCode, 10);
    const countryIso = resolveCountryToISO3(country);
    var region = null;
    if (!country || !zipCode) return callback('Country and zip code are required.');
    if (!countryIso.alpha3)
      return callback('Could not resolve country information.');
    if (storagedRegions.indexOf(countryIso.alpha3) >= 0) {
      const mappingZipCodeToBundeslaender = require('../regions/' + countryIso.alpha3);
      for (var i = 0; i < mappingZipCodeToBundeslaender.length; i++) {
        var mapping = mappingZipCodeToBundeslaender[i];
        if (zip >= mapping.low && zip <= mapping.high) {
          region = mapping.region;
          break;
        }
      }
    }

    if (!region) return this.detectWithGoogle(countryIso, zipCode, callback);
    return callback(null, region);
  };

  this.detectWithGoogle = function (countryIso, zipCode, callback) {
    var param = 'country=' + countryIso.alpha3 + ' postal_code=' + zipCode;
    const googleLink = 'https://maps.googleapis.com/maps/api/geocode/json' +
    '?key=' + this.apikey +
    '&address=####&sensor=true';
    request.get(googleLink.replace('####', encodeURIComponent(param)), function (err, res, body) {
      if (err || !body) return callback(err);
      var data = {
        results: [],
      };
      try {
        data = JSON.parse(body);
      } catch (e) {}

      if (data.results.length <= 0) return callback('NOT FOUND', null);

      //find country inside of the nestled array.
      var region = data.results[0].address_components.filter(function (component) {
        var typeFound = component.types.filter(function (type) {
          return type === 'administrative_area_level_1';
        })[0];

        return typeFound && typeFound.length > 0;
      })[0];

      if (!region) return callback('NOT FOUND');
      var result = countryIso.alpha2 + '-' + region.short_name.toUpperCase().replace('.', '');
      callback(null, result);
    });
  };
};

module.exports = regionIdentifier;
