const { deepEqual } = require('node:assert/strict');
const { describe, it } = require('node:test');

const {
  ensureSubset,
  resetValidationState,
  validateArrayFile,
  validateCountryConfig,
  validateGeocodeMappingEntry,
  validateRegionMappingEntry,
  validateRegionNames,
  validationState,
} = require('./validate-data');

function collectValidation(callback) {
  resetValidationState();
  callback();
  return validationState();
}

describe('validate-data basic checks', () => {
  it('validates country config shape and numeric zip length', () => {
    const { errors, warnings } = collectValidation(() => {
      validateCountryConfig('TST', null);
      validateCountryConfig('TST', { zipCodeFormat: 'numeric' });
      validateCountryConfig('TST', { zipCodeFormat: 'postal', zipCodeLength: 5 });
    });

    deepEqual(errors, [
      'country/TST.json: expected an object',
      'country/TST.json: numeric countries must define positive integer zipCodeLength',
      'country/TST.json: zipCodeFormat must be "numeric" or "alpha"',
    ]);
    deepEqual(warnings, []);
  });

  it('validates region names', () => {
    const { errors, warnings } = collectValidation(() => {
      validateRegionNames('TST', {
        'INVALID': '',
        'TS-A': 'Alpha',
      });
    });

    deepEqual(errors, [
      'regionNames/TST.json: invalid region code "INVALID"',
      'regionNames/TST.json: INVALID must have a non-empty name',
    ]);
    deepEqual(warnings, []);
  });

  it('validates region mapping entries against runtime matching rules', () => {
    const regionNames = { 'TS-A': 'Alpha' };
    const numericCountryConfig = { zipCodeFormat: 'numeric', zipCodeLength: 5 };
    const alphaCountryConfig = { zipCodeFormat: 'alpha' };

    const { errors, warnings } = collectValidation(() => {
      validateRegionMappingEntry({
        isoCode: 'TST',
        entry: { region: 'TS-A', low: 12_345 },
        index: 0,
        regionNames,
        countryConfig: numericCountryConfig,
      });
      validateRegionMappingEntry({
        isoCode: 'TST',
        entry: { region: 'TS-A', low: 20, high: 10 },
        index: 1,
        regionNames,
        countryConfig: numericCountryConfig,
      });
      validateRegionMappingEntry({
        isoCode: 'TST',
        entry: { region: 'TS-A', list: [12_345, 'ABC'] },
        index: 2,
        regionNames,
        countryConfig: numericCountryConfig,
      });
      validateRegionMappingEntry({
        isoCode: 'TST',
        entry: { region: 'TS-A', list: ['AB', 123] },
        index: 3,
        regionNames,
        countryConfig: alphaCountryConfig,
      });
    });

    deepEqual(errors, [
      'regions/TST.json[0]: low must be a string when high is omitted',
      'regions/TST.json[1]: low must not be greater than high',
      'regions/TST.json[2].list[1]: value must be numeric for numeric country config',
      'regions/TST.json[3].list[1]: value must be a non-empty string for non-numeric country config',
    ]);
    deepEqual(warnings, []);
  });

  it('validates geocode array and entry shape', () => {
    const { errors, warnings } = collectValidation(() => {
      validateArrayFile('geocode/TST.json', null);
      validateGeocodeMappingEntry({
        isoCode: 'TST',
        entry: { zip: '', latitude: null },
        index: 0,
      });
    });

    deepEqual(errors, [
      'geocode/TST.json: expected an array',
      'geocode/TST.json[0]: zip must be a non-empty string',
      'geocode/TST.json[0]: latitude must be a string or finite number',
      'geocode/TST.json[0]: longitude must be a string or finite number',
    ]);
    deepEqual(warnings, []);
  });

  it('validates subset relationships used by allowlist sync checks', () => {
    const { errors, warnings } = collectValidation(() => {
      ensureSubset(
        new Set(['NOR']),
        new Set(['DEU']),
        (isoCode) => `lib/region.js availableCountries: missing "${isoCode}"`,
      );
    });

    deepEqual(errors, ['lib/region.js availableCountries: missing "NOR"']);
    deepEqual(warnings, []);
  });
});
