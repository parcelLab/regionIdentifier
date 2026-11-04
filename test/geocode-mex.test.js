const { deepEqual, equal, match, ok } = require('node:assert/strict');
const { describe, it } = require('node:test');

const data = require('../geocode/MEX.json');
const coordinates = require('../lib/geocode');

describe('Mexico postal coordinates', () => {
  it('looks up full five-digit codes and keeps leading zeros', () => {
    for (const country of ['MEX', 'MX', 'Mexico']) {
      deepEqual(coordinates(country, '01000'), ['-99.203300', '19.358700']);
    }
    deepEqual(coordinates('MEX', ' \t01000\n'), ['-99.203300', '19.358700']);
    deepEqual(coordinates('MEX', '20000'), ['-102.280600', '21.873400']);
  });

  it('uses the mean of distinct locality points for rural 99998', () => {
    deepEqual(coordinates('MEX', '99998'), ['-103.142133', '21.101533']);
  });

  it('does not guess missing, malformed, prefix, or known misplaced codes', () => {
    for (const code of ['00000', '99999', '010', '1000', '01 000', '01000x', '23300']) {
      equal(coordinates('MEX', code), undefined);
    }
  });

  it('contains unique full codes and finite WGS84 coordinate strings', () => {
    equal(data.length, 32447);
    equal(new Set(data.map((entry) => entry.zip)).size, data.length);
    for (const entry of data) {
      match(entry.zip, /^\d{5}$/);
      for (const [key, limit] of [
        ['longitude', 180],
        ['latitude', 90],
      ]) {
        match(entry[key], /^-?\d+\.\d{6}$/);
        ok(Number.isFinite(Number(entry[key])) && Math.abs(Number(entry[key])) <= limit);
      }
    }
  });
});
