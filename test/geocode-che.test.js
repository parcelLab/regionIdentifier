const { deepEqual, equal, ok } = require('node:assert/strict');
const { test } = require('node:test');

const data = require('../geocode/CHE.json');
const coordinates = require('../lib/geocode');

test('CHE resolves urban, rural Alpine, border and shared postcodes', () => {
  deepEqual(coordinates('CHE', '8001'), ['8.542', '47.37']);
  deepEqual(coordinates('CH', '3823'), ['7.96', '46.59']);
  deepEqual(coordinates('Switzerland', '7563'), ['10.37', '46.95']);
  deepEqual(coordinates('CHE', '2300'), ['6.826', '47.1']);
  deepEqual(coordinates('CHE', '8001 Zürich'), coordinates('CHE', '8001'));
  for (const zip of ['0000', '08001', '800', '9485', '3001', 'CH-8001']) {
    equal(coordinates('CHE', zip), undefined);
  }
});

test('CHE has unique four-digit codes and finite WGS84 coordinates', () => {
  equal(data.length, 3177);
  equal(new Set(data.map((row) => row.zip)).size, data.length);
  for (const row of data) {
    ok(/^\d{4}$/.test(row.zip));
    const longitude = Number(row.longitude);
    const latitude = Number(row.latitude);
    ok(Number.isFinite(longitude) && longitude >= -180 && longitude <= 180);
    ok(Number.isFinite(latitude) && latitude >= -90 && latitude <= 90);
    deepEqual(coordinates('CHE', row.zip), [row.longitude, row.latitude]);
  }
});
