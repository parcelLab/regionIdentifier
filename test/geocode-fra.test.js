const { deepEqual, equal, ok } = require('node:assert/strict');
const { test } = require('node:test');

const coordinates = require('../lib/geocode');
const data = require('../geocode/FRA.json');

test('FRA resolves official postal codes as longitude/latitude strings', () => {
  for (const country of ['FRA', 'FR', 'France']) {
    deepEqual(coordinates(country, '75001'), ['2.336', '48.86']);
  }
  deepEqual(coordinates('FRA', '75001 Paris'), ['2.336', '48.86']);
  deepEqual(coordinates('FRA', '01400'), ['4.991', '46.14']);
  deepEqual(coordinates('FRA', '20000'), ['8.706', '41.92']);
  deepEqual(coordinates('FRA', '97400'), ['55.44', '-20.94']);
  deepEqual(coordinates('FRA', '97600'), ['45.19', '-12.76']);
  for (const zip of ['00000', '75000', '1400', '75 001', '98000', '97133']) {
    equal(coordinates('FRA', zip), undefined);
  }
});

test('FRA data has one finite representative point per five-digit postal code', () => {
  equal(data.length, 6187);
  equal(new Set(data.map((row) => row.zip)).size, data.length);
  for (const row of data) {
    ok(/^\d{5}$/.test(row.zip));
    ok(Number.isFinite(Number(row.latitude)) && Math.abs(Number(row.latitude)) <= 90);
    ok(Number.isFinite(Number(row.longitude)) && Math.abs(Number(row.longitude)) <= 180);
    deepEqual(coordinates('FRA', row.zip), [row.longitude, row.latitude]);
  }
});
