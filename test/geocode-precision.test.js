const { deepEqual, equal, throws } = require('node:assert/strict');
const { readFileSync, readdirSync } = require('node:fs');
const path = require('node:path');
const { it } = require('node:test');
const compactGeocode = require('../scripts/compact-geocode');

it('rounds significant digits, preserves postal codes, and is idempotent', () => {
  const points = [
    { zip: '00123', latitude: '0.00123456', longitude: '-123.456' },
    { zip: 'AB 1', latitude: '9.9999', longitude: '-0' },
  ];
  const rounded = compactGeocode(points);
  deepEqual(rounded, [
    { zip: '00123', latitude: '0.001235', longitude: '-123.5' },
    { zip: 'AB 1', latitude: '10', longitude: '0' },
  ]);
  deepEqual(compactGeocode(rounded), rounded);
  equal(points[0].longitude, '-123.456');
  for (const invalid of ['', 'NaN', 'Infinity', '91', null]) {
    throws(() => compactGeocode([{ zip: '00123', latitude: invalid, longitude: '0' }]));
  }
});

it('keeps every distributed geocode file compact and rounded to four significant digits', () => {
  const directory = path.join(__dirname, '..', 'geocode');
  for (const name of readdirSync(directory)) {
    if (!name.endsWith('.json')) continue;
    const content = readFileSync(path.join(directory, name), 'utf8');
    const points = JSON.parse(content);
    equal(content, `${JSON.stringify(compactGeocode(points))}\n`, name);
  }
});
