const assert = require('node:assert/strict');
const { test } = require('node:test');

const data = require('../geocode/AUS.json');
const coordinates = require('../lib/geocode');
const generate = require('../scripts/generate-aus-geocode');

test('AUS resolves full postcodes and preserves leading zeros and coordinate strings', () => {
  for (const country of ['AUS', 'AU', 'Australia']) {
    assert.deepEqual(coordinates(country, '0800'), ['130.841550', '-12.461000']);
    assert.deepEqual(coordinates(country, ' 2000 '), ['151.204386', '-33.865529']);
  }
  assert.deepEqual(coordinates('AUS', '4482'), ['139.866600', '-25.814900']);
  assert.deepEqual(coordinates('AUS', '2898'), ['159.068300', '-31.527900']);
  for (const zip of ['0000', '800', '20 00', '2000 NSW', '2899', '6798', '6799']) {
    assert.equal(coordinates('AUS', zip), undefined);
  }
});

test('AUS data has one valid point per postcode and matches actual lookup', () => {
  assert.equal(data.length, 3044);
  assert.equal(new Set(data.map((row) => row.zip)).size, data.length);
  for (const { zip, latitude, longitude } of data) {
    assert.match(zip, /^\d{4}$/);
    assert(Number.isFinite(Number(latitude)) && Number(latitude) >= -44 && Number(latitude) <= -9);
    assert(
      Number.isFinite(Number(longitude)) && Number(longitude) >= 113 && Number(longitude) <= 160,
    );
    assert.deepEqual(coordinates('AUS', zip), [longitude, latitude]);
  }
});

const row = (latitude, longitude, accuracy = 6) =>
  ['AU', '0800', 'Test', '', '', '', '', '', '', latitude, longitude, accuracy].join('\t');

test('AUS generation ignores duplicate points and estimated rows, independent of order', () => {
  const first = row(-12, 130);
  const second = row(-14, 132);
  const estimated = row(-30, 150, 1);
  const expected = [{ zip: '0800', latitude: '-13.000000', longitude: '131.000000' }];
  assert.deepEqual(generate([first, first, second, estimated].join('\n')), expected);
  assert.deepEqual(generate([estimated, second, first].join('\n')), expected);
  assert.deepEqual(generate(estimated), []);
  assert.throws(() => generate(row('NaN', 130)));
  assert.throws(() => generate(row(-12, 181)));
  assert.throws(() => generate(first.replace('0800', '800')));
});
