const RegionIdentifier = require('../lib/region');
const expect = require('chai').expect;

const regionIdentifier = new RegionIdentifier('<API KEY>');

const countriesPostalCodes = {
  'Austria': [
    { name: 'AUT', zip: '1999', result: 'AT-9' },
    { name: 'Austria', zip: '1999', result: 'AT-9' },
  ],
  'Deutschland': [
    { name: 'DEU', zip: '6578', result: 'DE-TH' },
  ],
  'Belgium': [
    { name: 'BEL', zip: '1701', result: 'BE-VLG' },
  ],
  'Switzerland': [
    { name: 'CHE', zip: '2333', result: 'CH-BE' },
    { name: 'CHE', zip: '9488', result: 'CH-SG' },
  ],
  'Spain': [
    { name: 'ESP', zip: '04004', result: 'ES-AN' },
  ],
  'France': [
    { name: 'FRA', zip: '25090', result: 'FR-I' },
    { name: 'FRA', zip: '92440', result: 'FR-J' },
    { name: 'FRA', zip: '75116', result: 'FR-J' },
    { name: 'FRA', zip: '51000', result: 'FR-G' },
    { name: 'FRA', zip: '51100', result: 'FR-G' },
    { name: 'FRA', zip: '75020', result: 'FR-J' },
    { name: 'FR', zip: '25090', result: 'FR-I' },
    { name: 'FR', zip: '87200', result: 'FR-L' },
    { name: 'FR', zip: '87200 CEDEX 1', result: 'FR-L' },
    { name: 'FR', zip: '61100', result: 'FR-P' },
    { name: 'FR', zip: '81000', result: 'FR-N' },
  ],
  'United Kingdom': [
    { name: 'GBR', zip: 'PA13 4PS', result: 'GB-SCT' },
    { name: 'GBR', zip: 'EC2N 1AR', result: 'GB-ENG' },
    { name: 'GBR', zip: 'FY83QN', result: 'GB-ENG' },
    { name: 'GBR', zip: 'CF466RT', result: 'GB-WLS' },
    { name: 'GBR', zip: 'AL10 9BL', result: 'GB-ENG' },
    { name: 'GBR', zip: 'm14 5pq', result: 'GB-ENG' },
    { name: 'GBR', zip: 'Po10 8Eg', result: 'GB-ENG' },
    { name: 'GBR', zip: 'L5 3QN', result: 'GB-ENG' },
  ],
  'Italy': [
    { name: 'ITA', zip: '67033', result: 'IT-65' },
    { name: 'ITA', zip: '41121', result: 'IT-45' },
  ],
  'Netherlands': [
    { name: 'NLD', zip: '3541', result: 'NL-UT' },
    { name: 'NLD', zip: '6869 VC', result: 'NL-GE' },
    { name: 'NLD', zip: '2294 HC', result: 'NL-ZH' },
    { name: 'NLD', zip: '2294HC', result: 'NL-ZH' },
  ],
  'Canada': [
    { name: 'CAN', zip: 'X1A 0E2', result: 'CA-NT' },
    { name: 'CAN', zip: 'X1A 0E2', result: 'CA-NT' },
    { name: 'CAN', zip: 'X1A0E2', result: 'CA-NT' },
    { name: 'CAN', zip: 'G1P 2J1', result: 'CA-QC' },
    { name: 'CAN', zip: 'S0J 0G0', result: 'CA-SK' },
  ],
  'Mexico': [
    { name: 'MEX', zip: '06000', result: 'MX-CMX' },
  ],
  'United States': [
    { name: 'USA', zip: '972022239', result: 'US-OR' },
    { name: 'USA', zip: '06103', result: 'US-CT' },
    { name: 'USA', zip: '00646', result: 'US-PR' },
    { name: 'USA', zip: '96799', result: 'US-AS' },
    { name: 'USA', zip: '96921', result: 'US-GU' },
    { name: 'USA', zip: '96951', result: 'US-MP' },
    { name: 'USA', zip: '00831', result: 'US-VI' },
    { name: 'USA', zip: '10038', result: 'US-NY' },
  ],
  'Qatar': [
    { name: 'QAT', zip: '06000', result: null },
  ],
  'Sweden': [
    { name: 'SWE', zip: '11337', result: 'SE-AB' },
    { name: 'SWE', zip: '95435', result: 'SE-BD' },
    { name: 'SWE', zip: '23531', result: 'SE-M' },
    { name: 'SWE', zip: '10000', result: 'SE-AB' },
    { name: 'SWE', zip: '99999', result: 'SE-BD' },
    { name: 'SWE', zip: '81999', result: 'SE-C' },
  ],
  'Finland': [
    { name: 'FIN', zip: '00940', result: 'FI-18' },
    { name: 'FIN', zip: '70840', result: 'FI-15' },
    { name: 'FIN', zip: '96900', result: 'FI-10' },
    { name: 'FIN', zip: '00100', result: 'FI-18' },
    { name: 'FIN', zip: '99990', result: 'FI-10' },
    { name: 'FIN', zip: '20200', result: 'FI-19' },
    { name: 'FIN', zip: '22100', result: 'FI-01' },
  ],
};

describe('REGION IDENTIFIER', () => {
  Object.entries(countriesPostalCodes).forEach(([countryName, countryPostalCodes]) => {
    describe(
      `Testing get function for ${countryName.toUpperCase()}`,
      () => {
        countryPostalCodes.forEach((test) => {
          regionIdentifier.get(test.name, test.zip, (err, region, googleUsed) => {
            it(
              `Should return ${test.result} for ${test.name} with postal code ${test.zip}`,
              () => {
                expect(region).to.be.equals(test.result);
                expect(err).to.be.null;
                expect(googleUsed).to.be.equals(false);
              },
            );
          });
        });
      },
    );
  });
});
