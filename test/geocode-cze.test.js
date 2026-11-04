const { deepEqual, equal, ok, throws } = require('node:assert/strict');
const { test } = require('node:test');

const data = require('../geocode/CZE.json');
const coordinates = require('../lib/geocode');
const generate = require('../scripts/generate-geocode-cze');

test('CZE supports compact and spaced postcodes and country aliases', () => {
  for (const country of ['CZE', 'CZ', 'Czech Republic']) {
    for (const zip of ['11000', '110 00', ' 110 00 ']) {
      deepEqual(coordinates(country, zip), ['14.425633', '50.084633']);
    }
  }
  deepEqual(coordinates('CZE', '353 01'), ['12.710055', '49.976003']);
  deepEqual(coordinates('CZE', '73998'), ['18.793250', '49.523850']);
  for (const zip of ['00000', '011000', '110', '110  00', '11000 extra', 'CZ-11000']) {
    equal(coordinates('CZE', zip), undefined);
  }
  deepEqual(coordinates('DEU', '01945'), ['14', '51.4333']);
});

test('CZE contains unique full postcodes and finite coordinates', () => {
  equal(data.length, 2694);
  equal(new Set(data.map(({ zip }) => zip)).size, data.length);
  for (const { zip, latitude, longitude } of data) {
    ok(/^[1-7]\d{4}$/.test(zip));
    ok(Number.isFinite(Number(latitude)) && Number(latitude) >= 48 && Number(latitude) <= 52);
    ok(Number.isFinite(Number(longitude)) && Number(longitude) >= 12 && Number(longitude) <= 19);
    deepEqual(coordinates('CZE', zip), [longitude, latitude]);
  }
});

const row = (latitude, longitude) =>
  ['CZ', '110 00', '', '', '', '', '', '', '', latitude, longitude, '4'].join('\t');

test('CZE generation averages distinct points without duplicate weighting', () => {
  const first = row('50', '14');
  const second = row('51', '16');
  deepEqual(generate(`${first}\n${first}\n${second}`), [
    { zip: '11000', latitude: '50.500000', longitude: '15.000000' },
  ]);
  deepEqual(generate(`${second}\n${first}`), generate(`${first}\n${second}`));
  throws(() => generate(row('NaN', '14')));
  throws(() => generate(row('50', '200')));
});
