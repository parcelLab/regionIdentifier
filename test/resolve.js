const RegionIdentifier = require('../lib/region');

const identifier = new RegionIdentifier('<API KEY>');
const country = 'DEU';
const zip = '79761';

identifier.get(country, zip, (err, region, googleUsed) => {
  if (err) return console.log(err);

  console.log('~~~');
  console.log('Got' + (googleUsed ? ' w/ Google' : ''));
  console.log(region);
  console.log('~~~');
});
