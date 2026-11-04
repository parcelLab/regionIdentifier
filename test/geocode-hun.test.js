const { deepEqual, equal, ok } = require('node:assert/strict');
const { it } = require('node:test');

const coordinates = require('../lib/geocode');
const data = require('../geocode/HUN.json');

it('looks up Hungarian urban, rural and border postal codes', () => {
  for (const country of ['HUN', 'HU', 'Hungary']) {
    deepEqual(coordinates(country, '1014'), ['19.0404', '47.4984']);
    deepEqual(coordinates(country, ' 1014 '), ['19.0404', '47.4984']);
  }
  deepEqual(coordinates('HUN', '9945'), ['16.3531', '46.7890']);
  deepEqual(coordinates('HUN', '3999'), ['21.4167', '48.5500']);
  deepEqual(coordinates('HUN', '7370'), ['18.1151', '46.2559']);
});

it('does not turn malformed or unknown Hungarian codes into known codes', () => {
  for (const zip of ['0000', '01014', '101', '10140', '10 14', 'H-1014', '1014 Budapest']) {
    equal(coordinates('HUN', zip), undefined);
  }
});

it('has one finite approximate point per four-digit Hungarian postal code', () => {
  equal(data.length, 3046);
  equal(new Set(data.map((entry) => entry.zip)).size, data.length);
  for (const entry of data) {
    ok(/^[1-9]\d{3}$/.test(entry.zip));
    const point = coordinates('HUN', entry.zip).map(Number);
    ok(point.every((value) => Number.isFinite(value)));
    ok(point[0] >= 16 && point[0] <= 23);
    ok(point[1] >= 45 && point[1] <= 49);
  }
});
