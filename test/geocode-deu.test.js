const { deepEqual, equal, ok } = require('node:assert/strict');
const { test } = require('node:test');

const data = require('../geocode/DEU.json');
const coordinates = require('../lib/geocode');

test('DEU has one finite representative point per five-digit postal code', () => {
  equal(data.length, 10815);
  equal(new Set(data.map(({ zip }) => zip)).size, data.length);
  for (const { zip, latitude, longitude } of data) {
    ok(/^\d{5}$/.test(zip));
    ok(Number.isFinite(Number(latitude)) && Number(latitude) >= 47 && Number(latitude) <= 56);
    ok(Number.isFinite(Number(longitude)) && Number(longitude) >= 5 && Number(longitude) <= 16);
  }
});

test('DEU lookup preserves strings, leading zeros, aliases and trailing locality input', () => {
  for (const country of ['DEU', 'DE', 'Germany']) {
    for (const zip of ['01067', '01067 Dresden']) {
      deepEqual(coordinates(country, zip), ['13.726900', '51.054700']);
    }
  }
  deepEqual(coordinates('DEU', '01945'), ['13.878122', '51.419711']);
  deepEqual(coordinates('DEU', '27498'), ['7.886300', '54.181400']);
  deepEqual(coordinates('DEU', '87561'), ['10.279400', '47.407200']);
  for (const zip of ['00000', '99999', '1067', '01 067']) {
    equal(coordinates('DEU', zip), undefined);
  }
});
