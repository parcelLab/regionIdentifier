const { deepEqual, equal, ok } = require('node:assert/strict');
const { it } = require('node:test');

const coordinates = require('../lib/geocode');
const data = require('../geocode/NLD.json');

it('looks up NLD four-digit prefixes and full postal codes', () => {
  for (const zip of ['1012', '1012AB', '1012 AB', '1012 ab', ' 1012\tAB ']) {
    deepEqual(coordinates('NLD', zip), ['4.895100', '52.373500']);
  }
  deepEqual(coordinates('NL', '1791WX'), ['4.794900', '53.056500']);
  deepEqual(coordinates('Netherlands', '9979XX'), ['6.830300', '53.444500']);
  deepEqual(coordinates('NLD', '6291VV'), ['6.015400', '50.772000']);
});

it('returns undefined for unknown or malformed NLD codes', () => {
  for (const zip of ['0000', '0123AB', '0999ZZ', '101', '1012ABC', '1012 garbage']) {
    equal(coordinates('NLD', zip), undefined);
  }
});

it('has one finite representative point per NLD prefix', () => {
  equal(data.length, 4086);
  equal(new Set(data.map((entry) => entry.zip)).size, data.length);
  for (const entry of data) {
    ok(/^\d{4}$/.test(entry.zip));
    for (const [key, limit] of [
      ['latitude', 90],
      ['longitude', 180],
    ]) {
      ok(Number.isFinite(Number(entry[key])));
      ok(Math.abs(Number(entry[key])) <= limit);
    }
    deepEqual(coordinates('NLD', entry.zip), [entry.longitude, entry.latitude]);
  }
});
