const { deepEqual, equal, ok, match } = require('node:assert/strict');
const { test } = require('node:test');

const coordinates = require('../lib/geocode');
const data = require('../geocode/ROU.json');

test('ROU resolves full six-digit codes, aliases and leading zeros', () => {
  for (const country of ['ROU', 'RO', 'Romania']) {
    deepEqual(coordinates(country, '010011'), ['26.0602', '44.4914']);
  }
  deepEqual(coordinates('ROU', ' 010011 '), ['26.0602', '44.4914']);
  deepEqual(coordinates('ROU', '060274'), ['26.0174', '44.4378']);
  deepEqual(coordinates('ROU', '200716'), ['23.8', '44.3167']);
  deepEqual(coordinates('ROU', '827060'), ['29.386', '45.1746']);
  deepEqual(coordinates('ROU', '510002'), ['23.5695', '46.08405']);
});

test('ROU does not infer missing, shortened or malformed codes', () => {
  for (const code of ['000000', '999999', '10011', '010', '010 011', '010011 extra']) {
    equal(coordinates('ROU', code), undefined);
  }
});

test('ROU data has unique full codes and valid coordinate strings', () => {
  equal(data.length, 37914);
  equal(new Set(data.map((row) => row.zip)).size, data.length);
  for (const row of data) {
    match(row.zip, /^\d{6}$/);
    for (const [key, limit] of [
      ['longitude', 180],
      ['latitude', 90],
    ]) {
      equal(typeof row[key], 'string');
      ok(row[key].length > 0);
      ok(Number.isFinite(Number(row[key])) && Math.abs(Number(row[key])) <= limit);
    }
  }
});
