const { deepEqual, equal, ok } = require('node:assert/strict');
const { test } = require('node:test');
const coordinates = require('../lib/geocode');
const data = require('../geocode/SWE.json');

test('SWE accepts full compact and spaced postal codes', () => {
  for (const country of ['SWE', 'SE', 'Sweden']) {
    for (const zip of ['11120', '111 20']) {
      deepEqual(coordinates(country, zip), ['18.0649', '59.3326']);
    }
  }
  deepEqual(coordinates('SE', '624 66'), ['19.1333', '57.9167']);
  for (const zip of ['00000', '001 00', '111', '11120extra', '111  20']) {
    equal(coordinates('SE', zip), undefined);
  }
});

test('SWE data has unique full codes and valid coordinates', () => {
  equal(data.length, 18887);
  equal(new Set(data.map((row) => row.zip)).size, data.length);
  for (const row of data) {
    ok(/^\d{5}$/.test(row.zip));
    ok(Number.isFinite(Number(row.latitude)) && Math.abs(Number(row.latitude)) <= 90);
    ok(Number.isFinite(Number(row.longitude)) && Math.abs(Number(row.longitude)) <= 180);
  }
});
