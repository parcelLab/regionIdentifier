const { deepEqual, equal, ok, match } = require('node:assert/strict');
const { describe, it } = require('node:test');

const coordinates = require('../lib/geocode');
const data = require('../geocode/IRL.json');

describe('IRL routing-key coordinates', () => {
  it('accepts full, compact, lowercase and routing-key inputs', () => {
    for (const code of ['D01', 'D01 A3Y8', 'D01A3Y8', ' d01 a3y8 ']) {
      deepEqual(coordinates('IRL', code), ['-6.2545', '53.354']);
    }
    deepEqual(coordinates('IE', 'P75 RY96'), ['-9.45', '51.6833']);
    deepEqual(coordinates('Ireland', 'F94 DR52'), ['-8.2809', '54.4778']);
    deepEqual(coordinates('IRL', 'd6w'), ['-6.3012', '53.3087']);
  });

  it('does not resolve unknown, missing or malformed keys and suffixes', () => {
    for (const code of [
      'A65 F4E2',
      'Z99',
      'D1',
      'D01 ABC',
      'D01 ABCDE',
      'D01 !!!!',
      'D01 O000',
      'D01 A3Y8 extra',
    ]) {
      equal(coordinates('IRL', code), undefined);
    }
  });

  it('has 139 unique keys and finite WGS84 place points', () => {
    equal(data.length, 139);
    equal(new Set(data.map((entry) => entry.zip)).size, data.length);
    for (const entry of data) {
      match(entry.zip, /^(?:[A-Z]\d{2}|D6W)$/);
      const latitude = Number(entry.latitude);
      const longitude = Number(entry.longitude);
      ok(Number.isFinite(latitude) && latitude > 51 && latitude < 56);
      ok(Number.isFinite(longitude) && longitude > -11 && longitude < -5);
      deepEqual(coordinates('IRL', entry.zip), [entry.longitude, entry.latitude]);
    }
  });
});
