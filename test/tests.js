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
  name: 'CHE',
  zp: '9488',
  result: 'CH-SG',
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
  result: 'FR-I',
  usingGoogle: false,
}, {
  name: 'FRA',
  zp: '92440',
  result: 'FR-J',
  usingGoogle: false,
}, {
  name: 'FRA',
  zp: '75116',
  result: 'FR-J',
  usingGoogle: false,
}, {
  name: 'FRA',
  zp: '51000',
  result: 'FR-G',
  usingGoogle: false,
}, {
  name: 'FRA',
  zp: '51100',
  result: 'FR-G',
  usingGoogle: false,
}, {
  name: 'FRA',
  zp: '75020',
  result: 'FR-J',
  usingGoogle: false,
}, {
  name: 'FR',
  zp: '25090',
  result: 'FR-I',
  usingGoogle: false,
}, {
  name: 'FR',
  zp: '87200',
  result: 'FR-L',
  usingGoogle: false,
}, {
  name: 'FR',
  zp: '87200 CEDEX 1',
  result: 'FR-L',
  usingGoogle: false,
}, {
  name: 'FR',
  zp: '61100',
  result: 'FR-P',
  usingGoogle: false,
}, {
  name: 'FR',
  zp: '81000',
  result: 'FR-N',
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
  zp: 'AL10 9BL',
  result: 'GB-ENG',
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
  name: 'ITA',
  zp: '41121',
  result: 'IT-45',
  usingGoogle: false,
}, {
  name: 'NLD',
  zp: '3541',
  result: 'NL-UT',
  usingGoogle: false,
}, {
  name: 'NLD',
  zp: '6869 VC',
  result: 'NL-GE',
  usingGoogle: false,
}, {
  name: 'NLD',
  zp: '2294 HC',
  result: 'NL-ZH',
  usingGoogle: false,
}, {
  name: 'CAN',
  zp: 'X1A 0E2',
  result: 'CA-NT',
  usingGoogle: false,
}, {
  name: 'CAN',
  zp: 'X1A 0E2',
  result: 'CA-NT',
  usingGoogle: false,
}, {
  name: 'CAN',
  zp: 'X1A0E2',
  result: 'CA-NT',
  usingGoogle: false,
}, {
  name: 'CAN',
  zp: 'G1P 2J1',
  result: 'CA-QC',
  usingGoogle: false,
}];

describe('Beggining Test.', function () {

  describe('Testing get function', function () {
    tests.forEach(function (test) {
      identifier.get(test.name, test.zp, function (err, region, googleUsed) {
        var text = 'Validating result for: ' + test.name + ' with zip code: ' +
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
