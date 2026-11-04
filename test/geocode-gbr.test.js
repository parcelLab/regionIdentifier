const { deepEqual, equal, ok } = require('node:assert/strict');
const { test } = require('node:test');

const coordinates = require('../lib/geocode');
const data = require('../geocode/GBR.json');

test('GBR accepts district, spaced, compact, lowercase and surrounding whitespace', () => {
  for (const zip of ['SW1A', 'SW1A 0AA', 'SW1A0AA', 'sw1a 0aa', '  sw1a\t0aa  ']) {
    deepEqual(coordinates('GBR', zip), ['-0.1328', '51.5018']);
  }
  deepEqual(coordinates('GBR', 'JE1 1AA'), ['-2.1049', '49.1880']);
  deepEqual(coordinates('GB', 'BT1 5GS'), ['-5.9333', '54.5833']);
  deepEqual(coordinates('United Kingdom', 'TR21 0PT'), ['-6.3114', '49.9145']);
});

test('GBR rural and island districts use one representative point', () => {
  for (const [zip, west, east, south, north] of [
    ['ZE2 9NS', -2, 0, 59.5, 61],
    ['IV27 4AA', -6, -3, 57.5, 59],
  ]) {
    const [longitude, latitude] = coordinates('GBR', zip).map(Number);
    ok(longitude > west && longitude < east && latitude > south && latitude < north);
  }
  deepEqual(coordinates('GBR', 'ZE29NS'), coordinates('GBR', 'ZE2'));
});

test('GBR rejects unknown and malformed postcodes without a fallback', () => {
  for (const zip of [
    'ZZ99 9ZZ',
    '00000',
    'SW1A garbage',
    'SW1A 0AA extra',
    'SW 1A 0AA',
    'JE1 1AA',
  ]) {
    equal(coordinates('GBR', zip), undefined);
  }
});

test('GBR data has unique districts and finite WGS84 string coordinates', () => {
  equal(data.length, 3002);
  equal(new Set(data.map(({ zip }) => zip)).size, data.length);
  for (const { zip, longitude, latitude } of data) {
    ok(/^[A-Z]{1,2}\d[A-Z\d]?$/.test(zip));
    equal(typeof longitude, 'string');
    equal(typeof latitude, 'string');
    ok(Number.isFinite(Number(longitude)) && Math.abs(Number(longitude)) <= 180);
    ok(Number.isFinite(Number(latitude)) && Math.abs(Number(latitude)) <= 90);
    deepEqual(coordinates('GBR', zip), [longitude, latitude]);
  }
});
