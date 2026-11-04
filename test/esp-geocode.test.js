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
    ['04114', ['-2.1075', '36.9877']],
    ['28001', ['-3.6834', '40.4255']],
    ['08001', ['2.1687', '41.3799']],
    ['01200', ['-2.3912', '42.8516']],
    ['35001', ['-15.4134', '28.0997']],
    ['07001', ['2.6502', '39.5694']],
    ['51001', ['-5.3082', '35.8896']],
    ['52001', ['-2.9420', '35.2902']],
  ]) {
    assert.deepEqual(coordinates('ESP', zip), expected);
    assert.deepEqual(coordinates('ES', `${zip} locality`), expected);
  }
  assert.equal(coordinates('ESP', '00000'), undefined);
  assert.equal(coordinates('ESP', '1200'), undefined);
});
