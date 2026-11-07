const { equal, deepEqual, ok } = require('node:assert/strict');
const { it } = require('node:test');

const coordinates = require('../lib/geocode');
const data = require('../geocode/PRT.json');

it('looks up Portuguese full postal codes and supported separators', () => {
  for (const code of ['1000-996', '1000996', '1000 996', ' 1000-996 ']) {
    deepEqual(coordinates('PRT', code), ['-9.133', '38.72']);
  }
  deepEqual(coordinates('PT', '7750-329'), ['-7.661', '37.64']);
  deepEqual(coordinates('Portugal', '9000-994'), ['-16.9', '32.63']);
  deepEqual(coordinates('PRT', '9500-112'), ['-25.67', '37.75']);
  for (const code of ['0000-000', '1000', '1000-996 extra', '1000--996']) {
    equal(coordinates('PRT', code), undefined);
  }
});

it('has unique full codes and finite Portuguese coordinates', () => {
  equal(data.length, 197772);
  equal(new Set(data.map((entry) => entry.zip)).size, data.length);
  for (const entry of data) {
    ok(/^\d{4}-\d{3}$/.test(entry.zip));
    ok(Number.isFinite(Number(entry.latitude)));
    ok(Number.isFinite(Number(entry.longitude)));
    ok(Number(entry.latitude) >= 30 && Number(entry.latitude) <= 43);
    ok(Number(entry.longitude) >= -32 && Number(entry.longitude) <= -6);
  }
});
