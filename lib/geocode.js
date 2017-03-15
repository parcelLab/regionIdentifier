const Country = require('countryjs');
const request = require('request');

var coord = [
  {
    "zip": 34034,
    "latitude": 33.0364,
    "longitude": -82.2493
  },
  {
    "zip": 99553,
    "latitude": 54.143,
    "longitude": -165.7854
  },
  {
    "zip": 99571,
    "latitude": 55.1858,
    "longitude": -162.7211
  },
  {
    "zip": 99583,
    "latitude": 54.841,
    "longitude": -163.4368
  }
]

const availableCountries = 'DEU AUT BEL FRA ITA USA ESP NLD GBR CAN'.split(' ');

function validateZipCode(zip) {
  return zip.split(' ')[0];
}

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

function coordinates(country, zipCode, callback) {
  if (!country || !zipCode) return callback('Country and zip code are required.', null, false);

  const countryIso = resolveCountryToISO3(country);
  if (!countryIso) return callback('Could not resolve country information.', null, false);

  var validZip = validateZipCode(zipCode);

  if (availableCountries.indexOf(countryIso.alpha3) > -1) {
    var zipCodeToGeocode = require('../geocode/' + countryIso.alpha3);

    zipCodeToGeocode.find(x => {
      if(x.zip === validZip){
        console.log('lat: ' + x.latitude + ' long: ' + x.longitude);
      }
    });

  }

}

  // coordinates('FRA', "75003");
