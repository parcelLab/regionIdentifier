const { test } = require('node:test');
const assert = require('node:assert/strict');
const coordinates = require('../lib/geocode');
const data = require('../geocode/ESP.json');

test('ESP uses unique five-digit postal codes and finite coordinates', () => {
  assert.equal(data.length, 11150);
  assert.equal(new Set(data.map((entry) => entry.zip)).size, data.length);
  for (const entry of data) {
    assert.match(entry.zip, /^\d{5}$/);
    assert.ok(Number.isFinite(Number(entry.longitude)));
    assert.ok(Number.isFinite(Number(entry.latitude)));
    assert.ok(Math.abs(Number(entry.longitude)) <= 180);
    assert.ok(Math.abs(Number(entry.latitude)) <= 90);
  }
});

test('ESP resolves mainland, islands, and autonomous cities at postcode granularity', () => {
  for (const [zip, expected] of [
    ['04114', ['-2.107', '36.99']],
    ['28001', ['-3.683', '40.43']],
    ['08001', ['2.169', '41.38']],
    ['01200', ['-2.391', '42.85']],
    ['35001', ['-15.41', '28.1']],
    ['07001', ['2.65', '39.57']],
    ['51001', ['-5.308', '35.89']],
    ['52001', ['-2.942', '35.29']],
  ]) {
    assert.deepEqual(coordinates('ESP', zip), expected);
    assert.deepEqual(coordinates('ES', `${zip} locality`), expected);
  }
  assert.equal(coordinates('ESP', '00000'), undefined);
  assert.equal(coordinates('ESP', '1200'), undefined);
});
