const { deepEqual, equal, ok, throws } = require('node:assert/strict');
const { test } = require('node:test');

const data = require('../geocode/BEL.json');
const coordinates = require('../lib/geocode');

test('BEL returns full-postcode representative points in longitude, latitude order', () => {
  deepEqual(coordinates('BEL', '1000'), ['4.3488', '50.8504']);
  deepEqual(coordinates('BE', '1000 Bruxelles'), ['4.3488', '50.8504']);
  deepEqual(coordinates('Belgium', '4790'), ['6.135', '50.1956']);
  deepEqual(coordinates('BEL', '9990 Maldegem'), ['3.4451', '51.2074']);
  throws(() => coordinates('bel', '1000'), /Could not resolve country information/);
  for (const zip of ['0000', '0612', '612', '1005', '100', '10000', '10 00', 'BE-1000']) {
    equal(coordinates('BEL', zip), undefined);
  }
});

test('BEL has one valid string coordinate pair per four-digit postal code', () => {
  equal(data.length, 1146);
  equal(new Set(data.map(({ zip }) => zip)).size, data.length);
  for (const { zip, latitude, longitude } of data) {
    ok(/^\d{4}$/.test(zip));
    for (const [value, limit] of [
      [latitude, 90],
      [longitude, 180],
    ]) {
      equal(typeof value, 'string');
      ok(value.length > 0 && Number.isFinite(Number(value)));
      ok(Math.abs(Number(value)) <= limit);
    }
    deepEqual(coordinates('BEL', zip), [longitude, latitude]);
  }
});
