const Country = require('countryjs');
const request = require('request');
const rangeRegions = 'DEU AUT BEL FRA ITA CHE ESP NLD'.split(' ');
const matchRegion = 'GBR'.split(' ');

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
    if (!country || !zipCode) return callback('Country and zip code are required.');
    var zip;
    const countryIso = resolveCountryToISO3(country);
    var region = null;
    if (!countryIso) return callback('Could not resolve country information.');
    if (rangeRegions.indexOf(countryIso.alpha3) >= 0) {
      zip = parseInt(zipCode, 10);
      var mappingZipCodeToBundeslaender = require('../regions/' + countryIso.alpha3);
      for (var i = 0; i < mappingZipCodeToBundeslaender.length; i++) {
        var mapping = mappingZipCodeToBundeslaender[i];
        if (!mapping.high && zip === parseInt(mapping.low)) region = mapping.region;
        else if (zip >= mapping.low && zip <= mapping.high) region = mapping.region;
        if (region) break;
      }
    }

    if (matchRegion.indexOf(countryIso.alpha3) >= 0) {
      zip = zipCode.replace(/[0-9]/g, '');
      zip = zip.split(' ')[0];
      var mappingZipCodeToBundeslaender = require('../regions/' + countryIso.alpha3);
      for (var j = 0; j < mappingZipCodeToBundeslaender.length; j++) {
        var mapping = mappingZipCodeToBundeslaender[j];
        var regex = new RegExp(zip + '.*');
        if (regex.test(mapping.low)) {
          region = mapping.region;
          break;
        }
      }
    }

    if (!region && !zip) return this.detectWithGoogle(countryIso, zipCode, callback);
    if (!region) return callback('NOT FOUND.', null);
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

      if (data.results.length <= 0) return callback('NOT FOUND.', null);

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
