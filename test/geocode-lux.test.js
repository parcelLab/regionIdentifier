const { deepEqual, equal, ok } = require('node:assert/strict');
const { it } = require('node:test');

const data = require('../geocode/LUX.json');
const coordinates = require('../lib/geocode');

it('looks up full Luxembourg postal codes with longitude first', () => {
  deepEqual(coordinates('LUX', '1135'), ['6.112', '49.61']);
  deepEqual(coordinates('LU', '1420'), ['6.108', '49.61']);
  deepEqual(coordinates('Luxembourg', '9755'), ['6.058', '50.1']);
  deepEqual(coordinates('LUX', '9999 Wemperhardt'), ['6.053', '50.15']);
  for (const code of ['0000', '0123', '999', 'L-1135', '11350']) {
    equal(coordinates('LUX', code), undefined);
  }
});

it('contains unique four-digit Luxembourg codes and finite in-country points', () => {
  equal(data.length, 4200);
  equal(new Set(data.map((entry) => entry.zip)).size, data.length);
  for (const entry of data) {
    ok(/^\d{4}$/.test(entry.zip));
    const [longitude, latitude] = coordinates('LUX', entry.zip).map(Number);
    ok(Number.isFinite(longitude) && longitude >= 5.7 && longitude <= 6.6);
    ok(Number.isFinite(latitude) && latitude >= 49.4 && latitude <= 50.2);
    ok(/^\d+(?:\.\d+)?$/.test(entry.longitude));
    ok(/^\d+(?:\.\d+)?$/.test(entry.latitude));
  }
});
