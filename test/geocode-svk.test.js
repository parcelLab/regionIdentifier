const { test } = require('node:test');
const assert = require('node:assert/strict');
const coordinates = require('../lib/geocode');
const data = require('../geocode/SVK.json');

test('SVK supports full postal codes and leading zeros', () => {
  assert.deepEqual(coordinates('SVK', '01001'), ['18.78045', '49.21115']);
  assert.deepEqual(coordinates('SK', '010 01'), coordinates('SVK', '01001'));
  assert.deepEqual(coordinates('SVK', '013 06'), ['19.0294', '49.259']);
  for (const zip of ['00000', '010', '010 010', 'abcde']) {
    assert.equal(coordinates('SVK', zip), undefined);
  }
});

test('SVK dataset has unique full codes and valid coordinates', () => {
  assert.equal(data.length, 3480);
  assert.equal(new Set(data.map((row) => row.zip)).size, data.length);
  for (const row of data) {
    assert.match(row.zip, /^\d{5}$/);
    assert.ok(Number.isFinite(Number(row.latitude)) && Math.abs(Number(row.latitude)) <= 90);
    assert.ok(Number.isFinite(Number(row.longitude)) && Math.abs(Number(row.longitude)) <= 180);
    assert.deepEqual(coordinates('SVK', row.zip), [row.longitude, row.latitude]);
  }
});
