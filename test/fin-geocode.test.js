const { test } = require('node:test');
const { deepEqual, equal, ok, match } = require('node:assert/strict');
const coordinates = require('../lib/geocode');
const data = require('../geocode/FIN.json');

test('FIN resolves complete postal codes, including leading zeros and locality suffixes', () => {
  for (const country of ['FIN', 'FI', 'Finland']) {
    deepEqual(coordinates(country, '00100'), ['24.929290', '60.172204']);
    deepEqual(coordinates(country, '00100 Helsinki'), ['24.929290', '60.172204']);
  }
  deepEqual(coordinates('FIN', '22100'), ['19.943215', '60.099715']);
  deepEqual(coordinates('FIN', '21660'), ['21.855619', '60.187015']);
  deepEqual(coordinates('FIN', '98900'), ['28.538573', '66.910233']);
  deepEqual(coordinates('FIN', '99980'), ['27.068880', '69.722419']);
  for (const zip of ['00000', '001', '100', 'FI-00100', '99999']) {
    equal(coordinates('FIN', zip), undefined);
  }
});

test('FIN has one finite representative point per five-digit postal area', () => {
  equal(data.length, 3018);
  equal(new Set(data.map((row) => row.zip)).size, data.length);
  for (const row of data) {
    match(row.zip, /^\d{5}$/);
    const [longitude, latitude] = coordinates('FIN', row.zip).map(Number);
    ok(Number.isFinite(longitude) && longitude > 19 && longitude < 32);
    ok(Number.isFinite(latitude) && latitude > 59 && latitude < 71);
  }
});
