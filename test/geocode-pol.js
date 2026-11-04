const { deepEqual, equal, ok } = require('node:assert/strict');
const { it } = require('node:test');

const coordinates = require('../lib/geocode');
const data = require('../geocode/POL.json');

it('looks up full Polish postcodes and preserves leading zeros and coordinate strings', () => {
  for (const zip of ['00-002', '00002', '00 002', ' 00-002 ']) {
    deepEqual(coordinates('POL', zip), ['21.010100', '52.235800']);
  }
  deepEqual(coordinates('PL', '72-600'), ['14.256700', '53.903400']);
  deepEqual(coordinates('Poland', '38-713'), ['22.662531', '49.194825']);
  deepEqual(coordinates('POL', '59-700'), ['15.618324', '51.287024']);
});

it('does not invent Polish points for missing or malformed codes', () => {
  for (const zip of ['00-001', '99-999', '0002', '00', '00-002 extra', 'PL-00-002']) {
    equal(coordinates('POL', zip), undefined);
  }
  deepEqual(coordinates('DEU', '01945 extra'), ['14', '51.4333']);
});

it('contains unique full Polish postcodes with finite WGS84 points', () => {
  equal(data.length, 20299);
  equal(new Set(data.map((entry) => entry.zip)).size, data.length);
  for (const entry of data) {
    ok(/^\d{2}-\d{3}$/.test(entry.zip));
    for (const [key, limit] of [
      ['latitude', 90],
      ['longitude', 180],
    ]) {
      ok(typeof entry[key] === 'string');
      ok(Number.isFinite(Number(entry[key])) && Math.abs(Number(entry[key])) <= limit);
    }
  }
});
