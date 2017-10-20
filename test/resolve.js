const country = 'DEU';
const zip = '79761';

const RegionIdentifier = require('../lib/region');
var identifier = new RegionIdentifier('<API KEY>');

identifier.get(country, zip, function (err, region, googleUsed) {

  if (err) console.log(err);
  else {

    console.log('~~~');
    console.log('Got' + (googleUsed ? ' w/ Google' : ''));
    console.log(region);
    console.log('~~~');

  }

});
