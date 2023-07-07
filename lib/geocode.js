const Country = require('countryjs');

const availableCountries = 'DEU AUT BEL FRA ITA USA ESP NLD GBR CAN'.split(' ');

function validateZipCode(zip) {
  return zip.split(' ')[0];
}

function resolveCountryToISO3(countryInfo) {
  if (!countryInfo) return null;

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

function coordinates(country, zipCode, callback) {
  if (!country || !zipCode) return callback('Country and zip code are required.', null, false);

  const countryIso = resolveCountryToISO3(country);
  if (!countryIso) return callback('Could not resolve country information.', null, false);

  const validZip = validateZipCode(zipCode);

  if (availableCountries.includes(countryIso.alpha3)) {
    const zipCodeToGeocode = require(`../geocode/${countryIso.alpha3}`);

    zipCodeToGeocode.find(i => {
      if (i.zip === validZip) {
        callback([i.longitude, i.latitude]);
      }
    });
  }
}

module.exports = coordinates;
