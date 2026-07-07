const { GoogleMapsAPIError } = require('../lib/errors');
const RegionIdentifier = require('../lib/region');

const identifier = new RegionIdentifier('<API KEY>');
const country = 'DEU';
const zip = '79761';

async function resolve() {
  try {
    const [region, googleUsed] = await identifier.get(country, zip);

    console.log('~~~');
    console.log(`Got${googleUsed ? ' w/ Google' : ''}`);
    console.log(region);
    console.log('~~~');
  } catch (err) {
    console.error(err);

    if (err instanceof GoogleMapsAPIError) {
      console.error('Google Maps API error');
    }
  }
}

resolve();
