const assert = require('node:assert/strict');
const { test } = require('node:test');

const coordinates = require('../lib/geocode');
const data = require('../geocode/ITA.json');
const generate = require('../scripts/generate-ita-geocode');

test('ITA has unique full CAP codes and finite WGS84 points', () => {
  assert.equal(new Set(data.map((row) => row.zip)).size, data.length);
  for (const row of data) {
    assert.match(row.zip, /^\d{5}$/);
    assert.ok(Number.isFinite(Number(row.latitude)) && Math.abs(Number(row.latitude)) <= 90);
    assert.ok(Number.isFinite(Number(row.longitude)) && Math.abs(Number(row.longitude)) <= 180);
    assert.deepEqual(coordinates('ITA', row.zip), [row.longitude, row.latitude]);
  }
});

test('ITA supports leading zeros and existing space suffix behavior', () => {
  const rome = coordinates('ITA', '00186');
  assert.ok(Math.abs(Number(rome[0]) - 12.48) < 0.1);
  assert.ok(Math.abs(Number(rome[1]) - 41.9) < 0.1);
  assert.deepEqual(coordinates('IT', '00186 Roma'), rome);
  assert.equal(coordinates('ITA', '00000'), undefined);
  assert.equal(coordinates('ITA', '186'), undefined);
  const island = coordinates('ITA', '57031').map(Number);
  assert.ok(Math.abs(island[0] - 10.38) < 0.1 && Math.abs(island[1] - 42.75) < 0.1);
  assert.equal(coordinates('ITA', '92031'), undefined);
  const bormio = coordinates('ITA', '23032').map(Number);
  assert.ok(Math.abs(bormio[0] - 10.37) < 0.1 && Math.abs(bormio[1] - 46.47) < 0.1);
});

const line = (lat, lon) => `IT\t00100\tPlace\t\t\t\t\t\t\t${lat}\t${lon}\t4`;

test('ITA generation ignores duplicate points and input order', () => {
  const rows = [line(40, 10), line(41, 11), line(44, 14)];
  const expected = [{ zip: '00100', latitude: '41', longitude: '11' }];
  assert.deepEqual(generate(rows.join('\n')), expected);
  assert.deepEqual(generate([...rows.toReversed(), rows[2], rows[2]].join('\n')), expected);
  assert.throws(() => generate(line('NaN', 10)));
  assert.throws(() => generate(line(91, 10)));
});
