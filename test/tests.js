const RegionIdentifier = require('../lib/region');

var identifier = new RegionIdentifier('AIzaSyAyYRbYFwW3F7SPHhmNXh75xkwFL1o1ndU');

identifier.get('AUT', '1999', console.log);
identifier.get('BEL', '1701', console.log);
identifier.get('CHE', '2333', console.log);
identifier.get('DEU', '6578', console.log);
identifier.get('ESP', '49000', console.log);
identifier.get('FRA', '25090', console.log);
identifier.get('GBR', 'ZE43', console.log);
identifier.get('ITA', '67033', console.log);
identifier.get('NLD', '3541', console.log);
identifier.get('MEX', '35078', console.log);