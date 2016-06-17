const RegionIdentifier = require('../lib/region');
const expect = require('chai').expect;
var identifier = new RegionIdentifier('<API KEY>');

var tests = [{
  name: 'AUT',
  zp: '1999',
  result: 'AT-9',
  usingGoogle: false,
}, {
  name: 'Austria',
  usingGoogle: false,
  zp: '1999',
  result: 'AT-9',
}, {
  name: 'Deutschland',
  zp: '6578',
  result: 'DE-TH',
  usingGoogle: false,
}, {
  name: 'BEL',
  zp: '1701',
  result: 'BE-VLG',
  usingGoogle: false,
}, {
  name: 'CHE',
  zp: '2333',
  result: 'CH-BE',
  usingGoogle: false,
}, {
  name: 'DEU',
  zp: '6578',
  result: 'DE-TH',
  usingGoogle: false,
}, {
  name: 'ESP',
  zp: '04004',
  result: 'ES-AN',
  usingGoogle: false,
}, {
  name: 'FRA',
  zp: '25090',
  result: 'FR-D',
  usingGoogle: false,
}, {
  name: 'FR',
  zp: '25090',
  result: 'FR-D',
  usingGoogle: false,
}, {
  name: 'GBR',
  zp: 'PA13 4PS',
  result: 'GB-SCT',
  usingGoogle: false,
}, {
  name: 'GBR',
  zp: 'EC2N 1AR',
  result: 'GB-ENG',
  usingGoogle: false,
}, {
  name: 'GBR',
  zp: 'FY83QN',
  result: 'GB-ENG',
  usingGoogle: false,
}, {
  name: 'GBR',
  zp: 'CF466RT',
  result: 'GB-WLS',
  usingGoogle: false,
}, {
  name: 'GBR',
  zp: 'm14 5pq',
  result: 'GB-ENG',
  usingGoogle: false,
}, {
  name: 'GBR',
  zp: 'Po10 8Eg',
  result: 'GB-ENG',
  usingGoogle: false,
}, {
  name: 'GBR',
  zp: 'L5 3QN',
  result: 'GB-ENG',
  usingGoogle: false,
}, {
  name: 'ITA',
  zp: '67033',
  result: 'IT-65',
  usingGoogle: false,
}, {
  name: 'NLD',
  zp: '3541',
  result: 'NL-UT',
  usingGoogle: false,
}, {
  name: 'MEX',
  zp: '35078',
  result: 'MX-DUG',
  usingGoogle: true,
}];

describe('Beggining Test.', function () {

  describe('Testing get function', function () {
    tests.forEach(function (test) {
      identifier.get(test.name, test.zp, function (err, region, googleUsed) {
        var text = 'Validating result for: ' + test.name + ' with zip code:' +
          test.zp + ' result: ' + region + ', error: ' + err + ', google was used: ' + googleUsed;
        it(text, function () {
          expect(region).to.be.equals(test.result);
          expect(err).to.be.null;
          expect(googleUsed).to.be.equals(test.usingGoogle);
        });
      });
    });
  });

});
