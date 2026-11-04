const { deepEqual, equal, ok } = require('node:assert/strict');
const { test } = require('node:test');

const data = require('../geocode/AUT.json');
const coordinates = require('../lib/geocode');

test('AUT returns representative points in longitude/latitude order as strings', () => {
  deepEqual(coordinates('AUT', '1010'), ['16.3721', '48.2085']);
  deepEqual(coordinates('AT', '9942'), ['12.6058', '46.7135']);
  deepEqual(coordinates('Austria', '6991'), ['10.1876', '47.3578']);
  deepEqual(coordinates('AUT', '1010 Wien'), coordinates('AUT', '1010'));
  equal(coordinates('AUT', '0000'), undefined);
  equal(coordinates('AUT', '01010'), undefined);
  equal(coordinates('AUT', '101'), undefined);
});

test('AUT has unique four-digit codes and finite coordinates', () => {
  equal(data.length, 2501);
  equal(new Set(data.map((entry) => entry.zip)).size, data.length);
  for (const entry of data) {
    ok(/^\d{4}$/.test(entry.zip));
    for (const [key, limit] of [
      ['longitude', 180],
      ['latitude', 90],
    ]) {
      equal(typeof entry[key], 'string');
      ok(Number.isFinite(Number(entry[key])));
      ok(Math.abs(Number(entry[key])) <= limit);
    }
    deepEqual(coordinates('AUT', entry.zip), [entry.longitude, entry.latitude]);
  }
});
