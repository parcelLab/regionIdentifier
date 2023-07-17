const RegionIdentifier = require('../lib/region');
const expect = require('chai').expect;

const identifier = new RegionIdentifier('<API KEY>');

const countriesPostalCodes = {
  Austria: [{
    name: 'AUT',
    zp: '1999',
    result: 'AT-9',
    usingGoogle: false,
  }, {
    name: 'Austria',
    usingGoogle: false,
    zp: '1999',
    result: 'AT-9',
  }],
  Deutschland: [{
    name: 'DEU',
    zp: '6578',
    result: 'DE-TH',
    usingGoogle: false,
  }],
  Belgium: [{
    name: 'BEL',
    zp: '1701',
    result: 'BE-VLG',
    usingGoogle: false,
  }],
  Switzerland: [{
    name: 'CHE',
    zp: '2333',
    result: 'CH-BE',
    usingGoogle: false,
  }, {
    name: 'CHE',
    zp: '9488',
    result: 'CH-SG',
    usingGoogle: false,
  }],
  Spain: [{
    name: 'ESP',
    zp: '04004',
    result: 'ES-AN',
    usingGoogle: false,
  }],
  France: [{
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
  }],
  'United Kingdom': [{
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
  }],
  Italy: [{
    name: 'ITA',
    zp: '67033',
    result: 'IT-65',
    usingGoogle: false,
  }, {
    name: 'ITA',
    zp: '41121',
    result: 'IT-45',
    usingGoogle: false,
  }],
  Netherlands: [{
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
    name: 'NLD',
    zp: '2294HC',
    result: 'NL-ZH',
    usingGoogle: false,
  }],
  Canada: [{
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
  }, {
    name: 'CAN',
    zp: 'S0J 0G0',
    result: 'CA-SK',
    usingGoogle: false,
  }],
  Mexico: [{
    name: 'MEX',
    zp: '06000',
    result: 'MX-CMX',
    usingGoogle: false,
  }],
  'United States': [{
    name: 'USA',
    zp: '972022239',
    result: 'US-OR',
    usingGoogle: false,
  }, {
    name: 'USA',
    zp: '06103',
    result: 'US-CT',
    usingGoogle: false,
  }, {
    name: 'USA',
    zp: '00646',
    result: 'US-PR',
    usingGoogle: false,
  }, {
    name: 'USA',
    zp: '96799',
    result: 'US-AS',
    usingGoogle: false,
  }, {
    name: 'USA',
    zp: '96921',
    result: 'US-GU',
    usingGoogle: false,
  }, {
    name: 'USA',
    zp: '96951',
    result: 'US-MP',
    usingGoogle: false,
  }, {
    name: 'USA',
    zp: '00831',
    result: 'US-VI',
    usingGoogle: false,
  }, {
    name: 'USA',
    zp: '10038',
    result: 'US-NY',
    usingGoogle: false,
  }],
  Qatar: [{
    name: 'QAT',
    zp: '06000',
    result: null,
    usingGoogle: false,
  }]
};

describe('REGION IDENTIFIER', () => {
  Object.entries(countriesPostalCodes).forEach(([countryName, countryPostalCodes]) => {
    describe(`Testing get function for ${countryName}`, () => {
      countryPostalCodes.forEach((test) => {
        identifier.get(test.name, test.zp, (err, region, googleUsed) => {
          const testTitle = `Validating result for: ${test.name} with zip code: ${test.zp} result: ${region}, error: ${err}, google was used: ${googleUsed}`;
          it(testTitle, () => {
            expect(region).to.be.equals(test.result);
            expect(err).to.be.null;
            expect(googleUsed).to.be.equals(test.usingGoogle);
          });
        });
      });
    });
  });
});
