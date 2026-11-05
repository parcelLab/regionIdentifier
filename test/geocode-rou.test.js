const { deepEqual, equal, ok, match } = require('node:assert/strict');
const { test } = require('node:test');

const coordinates = require('../lib/geocode');
const data = require('../geocode/ROU.json');

test('ROU resolves full six-digit codes, aliases and leading zeros', () => {
  for (const country of ['ROU', 'RO', 'Romania']) {
    deepEqual(coordinates(country, '010011'), ['26.06', '44.49']);
  }
  deepEqual(coordinates('ROU', ' 010011 '), ['26.06', '44.49']);
  deepEqual(coordinates('ROU', '060274'), ['26.02', '44.44']);
  deepEqual(coordinates('ROU', '200716'), ['23.8', '44.32']);
  deepEqual(coordinates('ROU', '827060'), ['29.39', '45.17']);
  deepEqual(coordinates('ROU', '510002'), ['23.57', '46.08']);
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
