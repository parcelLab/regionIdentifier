const { GoogleMapsAPIError } = require('../lib/errors');
const RegionIdentifier = require('../lib/region');

const identifier = new RegionIdentifier('<API KEY>');
const country = 'DEU';
const zip = '79761';

identifier
  .get(country, zip)
  .then(([region, googleUsed]) => {
    console.log('~~~');
    console.log('Got' + (googleUsed ? ' w/ Google' : ''));
    console.log(region);
    console.log('~~~');
    return;
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch((err) => {
    console.error(err);

    if(err instanceof GoogleMapsAPIError) {
      console.error('Google Maps API error');
    }
  });
