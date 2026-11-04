const { deepEqual, equal, ok } = require('node:assert/strict');
const { test } = require('node:test');

const data = require('../geocode/CHE.json');
const coordinates = require('../lib/geocode');

test('CHE resolves urban, rural Alpine, border and shared postcodes', () => {
  deepEqual(coordinates('CHE', '8001'), ['8.5424538453222', '47.372308632286455']);
  deepEqual(coordinates('CH', '3823'), ['7.960046421526585', '46.58502033435045']);
  deepEqual(coordinates('Switzerland', '7563'), ['10.365456579963507', '46.94882200625801']);
  deepEqual(coordinates('CHE', '2300'), ['6.826320751992897', '47.100984494265035']);
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
