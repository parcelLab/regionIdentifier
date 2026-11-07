const { deepEqual, equal, ok } = require('node:assert/strict');
const { it } = require('node:test');

const coordinates = require('../lib/geocode');
const data = require('../geocode/POL.json');

it('looks up full Polish postcodes and preserves leading zeros and coordinate strings', () => {
  for (const zip of ['00-002', '00002', '00 002', ' 00-002 ']) {
    deepEqual(coordinates('POL', zip), ['21.01', '52.24']);
  }
  deepEqual(coordinates('PL', '72-600'), ['14.26', '53.9']);
  deepEqual(coordinates('Poland', '38-713'), ['22.66', '49.19']);
  deepEqual(coordinates('POL', '59-700'), ['15.62', '51.29']);
});

it('does not invent Polish points for missing or malformed codes', () => {
  for (const zip of ['00-001', '99-999', '0002', '00', '00-002 extra', 'PL-00-002']) {
    equal(coordinates('POL', zip), undefined);
  }
  deepEqual(coordinates('DEU', '01945 extra'), ['13.88', '51.42']);
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
