const assert = require('node:assert/strict');
const { test } = require('node:test');

const data = require('../geocode/LTU.json');
const coordinates = require('../lib/geocode');
const generateLtuGeocode = require('../scripts/generate-ltu-geocode');

const row = (latitude, longitude) => `LT\t00001\tPlace\t\t\t\t\t\t\t${latitude}\t${longitude}\t1`;

test('LTU resolves full postcodes, leading zeros and country prefixes', () => {
  for (const country of ['LTU', 'LT', 'Lithuania']) {
    for (const zip of ['04340', 'LT-04340', 'lt-04340', ' LT-04340 ']) {
      assert.deepEqual(coordinates(country, zip), ['25.2172', '54.6932']);
    }
  }
  // UPU rural/poste-restante example: Alanta, not a delivery-address centroid.
  assert.deepEqual(coordinates('LTU', '33037'), ['25.3', '55.35']);
  for (const zip of [
    '00000',
    '33264',
    '60249',
    '52002',
    '4340',
    '043400',
    '043 40',
    'LT 04340',
    '04340 junk',
  ]) {
    assert.equal(coordinates('LTU', zip), undefined);
  }
});

test('LTU data has unique five-digit codes and finite WGS84 coordinates', () => {
  assert.equal(data.length, 2023);
  assert.equal(new Set(data.map(({ zip }) => zip)).size, data.length);
  for (const { zip, latitude, longitude } of data) {
    assert.match(zip, /^\d{5}$/);
    assert(Number.isFinite(Number(latitude)) && Number(latitude) >= -90 && Number(latitude) <= 90);
    assert(
      Number.isFinite(Number(longitude)) && Number(longitude) >= -180 && Number(longitude) <= 180,
    );
  }
});

test('LTU generator averages distinct points without duplicate weighting', () => {
  const rows = [row(54, 24), row(54, 24), row(56, 26)];
  assert.deepEqual(generateLtuGeocode(rows.join('\n')), [
    { zip: '00001', latitude: '55', longitude: '25' },
  ]);
  assert.deepEqual(
    generateLtuGeocode(rows.toReversed().join('\n')),
    generateLtuGeocode(rows.join('\n')),
  );
  for (const text of [
    row('NaN', 24),
    row('', 24),
    row(91, 24),
    row(54, 181),
    row(54, 24).replace('00001', '0001'),
  ]) {
    assert.throws(() => generateLtuGeocode(text));
  }
});
