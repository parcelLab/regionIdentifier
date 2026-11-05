const { deepEqual, equal, ok } = require('node:assert/strict');
const { describe, it } = require('node:test');

const data = require('../geocode/KOR.json');
const coordinates = require('../lib/geocode');

describe('KOR postal coordinates', () => {
  it('resolves full codes, leading zeros, and existing space suffix handling', () => {
    for (const country of ['KOR', 'KR', 'South Korea']) {
      deepEqual(coordinates(country, '04524'), ['127', '37.57']);
    }
    deepEqual(coordinates('KOR', '04524 Seoul'), ['127', '37.57']);
    deepEqual(coordinates('KOR', '10003'), ['126.6', '37.73']);
    deepEqual(coordinates('KOR', '63002'), ['126.2', '33.35']);
    deepEqual(coordinates('KOR', '40240'), ['131.9', '37.24']);
  });

  it('does not guess missing, partial, or obsolete codes', () => {
    for (const code of ['00000', '99999', '045', '4524', '100-744', '04524X']) {
      equal(coordinates('KOR', code), undefined);
    }
  });

  it('has one finite point per five-digit postal code', () => {
    equal(data.length, 34249);
    equal(new Set(data.map((entry) => entry.zip)).size, data.length);
    for (const entry of data) {
      ok(/^\d{5}$/.test(entry.zip));
      for (const [key, limit] of [
        ['latitude', 90],
        ['longitude', 180],
      ]) {
        const value = Number(entry[key]);
        ok(Number.isFinite(value) && Math.abs(value) <= limit);
      }
    }
  });
});
