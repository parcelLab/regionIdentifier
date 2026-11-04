const { test } = require('node:test');
const { deepEqual, equal, ok } = require('node:assert/strict');
const coordinates = require('../lib/geocode');
const data = require('../geocode/SRB.json');

test('Serbia postal locality points and unknown codes', () => {
  deepEqual(coordinates('SRB', '11000'), ['20.4651', '44.804']);
  deepEqual(coordinates('RS', '11000 Beograd'), coordinates('SRB', '11000'));
  equal(coordinates('SRB', '00000'), undefined);
  equal(coordinates('SRB', '110000'), undefined);
  equal(new Set(data.map((row) => row.zip)).size, data.length);
  for (const row of data) {
    ok(/^\d{5}$/.test(row.zip));
    ok(
      Number.isFinite(Number(row.longitude)) &&
        Number(row.longitude) > 18 &&
        Number(row.longitude) < 24,
    );
    ok(
      Number.isFinite(Number(row.latitude)) &&
        Number(row.latitude) > 41 &&
        Number(row.latitude) < 47,
    );
    deepEqual(coordinates('SRB', row.zip), [row.longitude, row.latitude]);
  }
});
