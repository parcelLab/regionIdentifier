const RegionIdentifier = require('../lib/region');
const expect = require('chai').expect;
var identifier = new RegionIdentifier('<API KEY>');

var tests = [{
  name: 'AUT',
  zp: '1999',
  result: 'AT-9',
}, {
  name: 'Austria',
  zp: '1999',
  result: 'AT-9',
}, {
  name: 'Deutschland',
  zp: '6578',
  result: 'DE-TH',
}, {
  name: 'BEL',
  zp: '1701',
  result: 'BE-VLG',
}, {
  name: 'CHE',
  zp: '2333',
  result: 'CH-BE',
}, {
  name: 'DEU',
  zp: '6578',
  result: 'DE-TH',
}, {
  name: 'ESP',
  zp: '49000',
  result: 'ES-ZA',
}, {
  name: 'FRA',
  zp: '25090',
  result: 'FR-D',
}, {
  name: 'FR',
  zp: '25090',
  result: 'FR-D',
}, {
  name: 'GBR',
  zp: 'PA13 4PS',
  result: 'GB-SCT',
}, {
  name: 'ITA',
  zp: '67033',
  result: 'IT-65',
}, {
  name: 'NLD',
  zp: '3541',
  result: 'NL-UT',
}];

describe('Beggining Test.', function () {

  describe('Testing get function', function () {

    tests.forEach(function (test) {
      identifier.get(test.name, test.zp, function (err, region) {
        var text = 'Validating result for: ' + test.name + ' with zip code:' +
          test.zp + ' result: ' + region;
        it(text, function () {
          expect(region).to.be.equals(test.result);
          expect(err).to.be.null;
        });
      });
    });
  });
});
