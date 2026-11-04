const { deepEqual, equal, ok, match } = require('node:assert/strict');
const { it } = require('node:test');

const data = require('../geocode/NOR.json');
const coordinates = require('../lib/geocode');

it('resolves full Norwegian postcodes with leading zeros and optional NO- prefix', () => {
  for (const zip of ['0150', ' 0150 ', 'NO-0150', 'no-0150']) {
    deepEqual(coordinates('NOR', zip), ['10.7461', '59.9127']);
  }
  deepEqual(coordinates('NO', '5003'), ['5.3242', '60.393']);
  deepEqual(coordinates('Norway', '6783'), ['6.7179', '61.9026']);
  deepEqual(coordinates('NOR', '9900'), ['30.1604', '69.7197']);
  deepEqual(coordinates('NOR', '0001'), ['10.7461', '59.9127']);
  for (const zip of ['0000', '150', '01500', '01 50', '0150 Oslo', '9170']) {
    equal(coordinates('NOR', zip), undefined);
  }
});

it('contains unique full postcodes with finite WGS84 coordinates', () => {
  equal(data.length, 5092);
  equal(new Set(data.map(({ zip }) => zip)).size, data.length);
  for (const { zip, latitude, longitude } of data) {
    match(zip, /^\d{4}$/);
    for (const [value, limit] of [
      [latitude, 90],
      [longitude, 180],
    ]) {
      equal(typeof value, 'string');
      ok(value.length > 0 && Number.isFinite(Number(value)) && Math.abs(Number(value)) <= limit);
    }
  }
  deepEqual(coordinates('DEU', '01945'), ['14', '51.4333']);
});
