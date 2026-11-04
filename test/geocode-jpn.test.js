const { deepEqual, equal, ok } = require('node:assert/strict');
const { test } = require('node:test');

const coordinates = require('../lib/geocode');
const data = require('../geocode/JPN.json');

test('JPN resolves full postal codes with compact and hyphenated formats', () => {
  for (const country of ['JPN', 'JP', 'Japan']) {
    deepEqual(coordinates(country, '100-0001'), ['139.7521', '35.6841']);
    deepEqual(coordinates(country, '1000001'), ['139.7521', '35.6841']);
  }
  deepEqual(coordinates('JPN', '097-1201'), ['141.0412', '45.3021']);
  deepEqual(coordinates('JPN', '9071801'), ['123.0', '24.4667']);
  deepEqual(coordinates('JPN', '0691334'), ['141.6888', '43.0115']);
});

test('JPN does not turn prefixes, malformed or unknown codes into a location', () => {
  for (const zip of ['0000000', '100', '100 0001', '100-0001 extra', '100--0001', '971201']) {
    equal(coordinates('JPN', zip), undefined);
  }
});

test('JPN data preserves seven digits and contains one finite point per code', () => {
  equal(data.length, 142577);
  equal(new Set(data.map(({ zip }) => zip)).size, data.length);
  for (const { zip, longitude, latitude } of data) {
    ok(/^\d{7}$/.test(zip));
    ok(Number.isFinite(Number(longitude)) && Math.abs(Number(longitude)) <= 180);
    ok(Number.isFinite(Number(latitude)) && Math.abs(Number(latitude)) <= 90);
  }
});
