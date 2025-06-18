const { expect } = require('chai');

const RegionIdentifier = require('../lib/region');

const identifier = new RegionIdentifier('<API KEY>');

const countriesPostalCodes = {
  'Austria': [{
    name: 'AUT',
    zip: '1999',
    result: 'AT-9',
    usingGoogle: false,
  }, {
    name: 'Austria',
    usingGoogle: false,
    zip: '1999',
    result: 'AT-9',
  }],
  'Deutschland': [{
    name: 'DEU',
    zip: '6578',
    result: 'DE-TH',
    usingGoogle: false,
  }],
  'Belgium': [{
    name: 'BEL',
    zip: '1701',
    result: 'BE-VLG',
    usingGoogle: false,
  }],
  'Switzerland': [{
    name: 'CHE',
    zip: '2333',
    result: 'CH-BE',
    usingGoogle: false,
  }, {
    name: 'CHE',
    zip: '9488',
    result: 'CH-SG',
    usingGoogle: false,
  }],
  'Spain': [{
    name: 'ESP',
    zip: '04004',
    result: 'ES-AN',
    usingGoogle: false,
  }],
  'France': [{
    name: 'FRA',
    zip: '25090',
    result: 'FR-I',
    usingGoogle: false,
  }, {
    name: 'FRA',
    zip: '92440',
    result: 'FR-J',
    usingGoogle: false,
  }, {
    name: 'FRA',
    zip: '75116',
    result: 'FR-J',
    usingGoogle: false,
  }, {
    name: 'FRA',
    zip: '51000',
    result: 'FR-G',
    usingGoogle: false,
  }, {
    name: 'FRA',
    zip: '51100',
    result: 'FR-G',
    usingGoogle: false,
  }, {
    name: 'FRA',
    zip: '75020',
    result: 'FR-J',
    usingGoogle: false,
  }, {
    name: 'FR',
    zip: '25090',
    result: 'FR-I',
    usingGoogle: false,
  }, {
    name: 'FR',
    zip: '87200',
    result: 'FR-L',
    usingGoogle: false,
  }, {
    name: 'FR',
    zip: '87200 CEDEX 1',
    result: 'FR-L',
    usingGoogle: false,
  }, {
    name: 'FR',
    zip: '61100',
    result: 'FR-P',
    usingGoogle: false,
  }, {
    name: 'FR',
    zip: '81000',
    result: 'FR-N',
    usingGoogle: false,
  }],
  'United Kingdom': [{
    name: 'GBR',
    zip: 'PA13 4PS',
    result: 'GB-SCT',
    usingGoogle: false,
  }, {
    name: 'GBR',
    zip: 'EC2N 1AR',
    result: 'GB-ENG',
    usingGoogle: false,
  }, {
    name: 'GBR',
    zip: 'FY83QN',
    result: 'GB-ENG',
    usingGoogle: false,
  }, {
    name: 'GBR',
    zip: 'CF466RT',
    result: 'GB-WLS',
    usingGoogle: false,
  }, {
    name: 'GBR',
    zip: 'AL10 9BL',
    result: 'GB-ENG',
    usingGoogle: false,
  }, {
    name: 'GBR',
    zip: 'm14 5pq',
    result: 'GB-ENG',
    usingGoogle: false,
  }, {
    name: 'GBR',
    zip: 'Po10 8Eg',
    result: 'GB-ENG',
    usingGoogle: false,
  }, {
    name: 'GBR',
    zip: 'L5 3QN',
    result: 'GB-ENG',
    usingGoogle: false,
  }],
  'Italy': [{
    name: 'ITA',
    zip: '67033',
    result: 'IT-65',
    usingGoogle: false,
  }, {
    name: 'ITA',
    zip: '41121',
    result: 'IT-45',
    usingGoogle: false,
  }],
  'Netherlands': [{
    name: 'NLD',
    zip: '3541',
    result: 'NL-UT',
    usingGoogle: false,
  }, {
    name: 'NLD',
    zip: '6869 VC',
    result: 'NL-GE',
    usingGoogle: false,
  }, {
    name: 'NLD',
    zip: '2294 HC',
    result: 'NL-ZH',
    usingGoogle: false,
  }, {
    name: 'NLD',
    zip: '2294HC',
    result: 'NL-ZH',
    usingGoogle: false,
  }],
  'Canada': [{
    name: 'CAN',
    zip: 'X1A 0E2',
    result: 'CA-NT',
    usingGoogle: false,
  }, {
    name: 'CAN',
    zip: 'X1A 0E2',
    result: 'CA-NT',
    usingGoogle: false,
  }, {
    name: 'CAN',
    zip: 'X1A0E2',
    result: 'CA-NT',
    usingGoogle: false,
  }, {
    name: 'CAN',
    zip: 'G1P 2J1',
    result: 'CA-QC',
    usingGoogle: false,
  }, {
    name: 'CAN',
    zip: 'S0J 0G0',
    result: 'CA-SK',
    usingGoogle: false,
  }],
  'Mexico': [{
    name: 'MEX',
    zip: '06000',
    result: 'MX-CMX',
    usingGoogle: false,
  }],
  'United States': [{
    name: 'USA',
    zip: '972022239',
    result: 'US-OR',
    usingGoogle: false,
  }, {
    name: 'USA',
    zip: '06103',
    result: 'US-CT',
    usingGoogle: false,
  }, {
    name: 'USA',
    zip: '00646',
    result: 'US-PR',
    usingGoogle: false,
  }, {
    name: 'USA',
    zip: '96799',
    result: 'US-AS',
    usingGoogle: false,
  }, {
    name: 'USA',
    zip: '96921',
    result: 'US-GU',
    usingGoogle: false,
  }, {
    name: 'USA',
    zip: '96951',
    result: 'US-MP',
    usingGoogle: false,
  }, {
    name: 'USA',
    zip: '00831',
    result: 'US-VI',
    usingGoogle: false,
  }, {
    name: 'USA',
    zip: '10038',
    result: 'US-NY',
    usingGoogle: false,
  }],
  'Qatar': [{
    name: 'QAT',
    zip: '06000',
    result: null,
    usingGoogle: false,
  }],
  'Sweden': [{
    name: 'SWE',
    zip: '11337',
    result: 'SE-AB',
    usingGoogle: false,
  },{
    name: 'SWE',
    zip: '95435',
    result: 'SE-BD',
    usingGoogle: false,
  },{
    name: 'SWE',
    zip: '23531',
    result: 'SE-M',
    usingGoogle: false,
  },{
    name: 'SWE',
    zip: '10000',
    result: 'SE-AB',
    usingGoogle: false,
  },{
    name: 'SWE',
    zip: '99999',
    result: 'SE-BD',
    usingGoogle: false,
  },{
    name: 'SWE',
    zip: '81999',
    result: 'SE-C',
    usingGoogle: false,
  }],
  'Finland': [{
    name: 'FIN',
    zip: '00940',
    result: 'FI-18',
    usingGoogle: false,
  },{
    name: 'FIN',
    zip: '70840',
    result: 'FI-15',
    usingGoogle: false,
  },{
    name: 'FIN',
    zip: '96900',
    result: 'FI-10',
    usingGoogle: false,
  },{
    name: 'FIN',
    zip: '00100',
    result: 'FI-18',
    usingGoogle: false,
  },{
    name: 'FIN',
    zip: '99990',
    result: 'FI-10',
    usingGoogle: false,
  },{
    name: 'FIN',
    zip: '20200',
    result: 'FI-19',
    usingGoogle: false,
  },{
    name: 'FIN',
    zip: '22100',
    result: 'FI-01',
    usingGoogle: false,
  },{
    name: 'AUS',
    zip: '0841',
    result: 'AU-NT',
    usingGoogle: false,
  },{
    name: 'AUS',
    zip: '2111',
    result: 'AU-NSW',
    usingGoogle: false,
  }],
};

describe('REGION IDENTIFIER', () => {
  Object.entries(countriesPostalCodes).forEach(([countryName, countryPostalCodes]) => {
    describe(`get() for ${countryName}`, () => {
      countryPostalCodes.forEach(async (test) => {
        const [region, googleUsed] = await identifier.get(test.name, test.zip);

        it(`result for: ${test.name} with zip code: ${test.zip} result: ${region}, google was used: ${googleUsed}`, () => {
          expect(region).to.be.equals(test.result);
          expect(googleUsed).to.be.equals(test.usingGoogle);
        });
      });
    });
  });
});
