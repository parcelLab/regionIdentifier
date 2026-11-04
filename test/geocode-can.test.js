const { deepEqual, equal, ok } = require('node:assert/strict');
const { describe, it } = require('node:test');

const data = require('../geocode/CAN.json');
const coordinates = require('../lib/geocode');

describe('CAN FSA coordinates', () => {
  it('resolves FSA, spaced, compact and lowercase postal codes', () => {
    for (const zip of ['K1A', 'K1A 0A6', 'K1A0A6', ' k1a 0a6 ']) {
      deepEqual(coordinates('CAN', zip), ['-75.7023', '45.4207']);
    }
    deepEqual(coordinates('CA', 'M5V 3L9'), ['-79.3995', '43.6404']);
    deepEqual(coordinates('Canada', 'T0A 3A0'), ['-111.7174', '54.766']);
    const whitehorse = coordinates('CAN', 'Y1A 1C2').map(Number);
    ok(Math.abs(whitehorse[0] + 135.0561) < 0.2);
    ok(Math.abs(whitehorse[1] - 60.7242) < 0.2);
  });

  it('uses FSA precision and an unweighted mean of distinct source points', () => {
    deepEqual(coordinates('CAN', 'K1A 0A6'), coordinates('CAN', 'K1A 0G5'));
    deepEqual(coordinates('CAN', 'L9X'), ['-79.77035', '44.443175']);
    deepEqual(coordinates('CAN', 'C0A'), ['-62.6487', '46.1668']);
  });

  it('returns undefined for unknown, invalid and fictional codes', () => {
    for (const zip of ['Z9Z 9Z9', 'K1D', 'K1A123', 'K1A 0A6 extra', 'H0H 0H0', 'L0V']) {
      equal(coordinates('CAN', zip), undefined);
    }
  });

  it('has one finite, in-range point per supported FSA', () => {
    equal(data.length, 1650);
    equal(new Set(data.map((entry) => entry.zip)).size, data.length);
    for (const entry of data) {
      ok(/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]$/.test(entry.zip));
      const [longitude, latitude] = coordinates('CAN', entry.zip).map(Number);
      ok(Number.isFinite(latitude) && Math.abs(latitude) <= 90);
      ok(Number.isFinite(longitude) && Math.abs(longitude) <= 180);
    }
  });
});
