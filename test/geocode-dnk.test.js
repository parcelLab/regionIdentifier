const { deepEqual, equal, match, ok } = require('node:assert/strict');
const { test } = require('node:test');

const data = require('../geocode/DNK.json');
const coordinates = require('../lib/geocode');

test('DNK resolves full four-digit postcodes with string longitude and latitude', () => {
  for (const country of ['DNK', 'DK', 'Denmark']) {
    for (const zip of ['1050', 'DK-1050', 'dk1050', ' 1050 ']) {
      deepEqual(coordinates(country, zip), ['12.59', '55.68']);
    }
  }
  deepEqual(coordinates('DNK', '5970'), ['10.39', '54.88']);
  deepEqual(coordinates('DNK', '9990'), ['10.56', '57.72']);
  deepEqual(coordinates('DNK', '3700'), ['14.72', '55.11']);
  for (const zip of ['0000', '0892', '105', '10500', '1050 extra', '1 050', '3900']) {
    equal(coordinates('DNK', zip), undefined);
  }
});

test('DNK data has unique full codes and finite WGS84 coordinates', () => {
  equal(data.length, 1159);
  equal(new Set(data.map((entry) => entry.zip)).size, data.length);
  for (const entry of data) {
    match(entry.zip, /^\d{4}$/);
    ok(Number.isFinite(Number(entry.longitude)));
    ok(Number.isFinite(Number(entry.latitude)));
    ok(Number(entry.longitude) >= -180 && Number(entry.longitude) <= 180);
    ok(Number(entry.latitude) >= -90 && Number(entry.latitude) <= 90);
    deepEqual(coordinates('DNK', entry.zip), [entry.longitude, entry.latitude]);
  }
});
