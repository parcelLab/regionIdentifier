const { deepEqual, equal, ok, match } = require('node:assert/strict');
const { it } = require('node:test');
const coordinates = require('../lib/geocode');
const data = require('../geocode/USA.json');

it('looks up USA ZIP and ZIP+4 formats at five-digit precision', () => {
  for (const zip of ['00501', ' 00501 ', '00501-1234', '005011234', '00501 1234']) {
    deepEqual(coordinates('USA', zip), ['-73.0451', '40.8154']);
  }
  deepEqual(coordinates('US', '10001'), ['-73.9967', '40.7484']);
  deepEqual(coordinates('United States', '59001'), ['-109.4692', '45.5154']);
  deepEqual(coordinates('USA', '99553'), ['-165.7854', '54.143']);
  deepEqual(coordinates('USA', '96860'), ['-157.92255', '21.3304']);
});

it('returns undefined for unknown or malformed USA ZIP codes', () => {
  for (const zip of ['00000', '99999', '501', '00501-123', '00501x', '00501 12345', '00901']) {
    equal(coordinates('USA', zip), undefined);
  }
});

it('keeps USA codes unique and coordinates finite with string compatibility', () => {
  equal(data.length, 41488);
  equal(new Set(data.map((point) => point.zip)).size, data.length);
  for (const { zip, latitude, longitude } of data) {
    match(zip, /^\d{5}$/);
    equal(typeof latitude, 'string');
    equal(typeof longitude, 'string');
    ok(Number.isFinite(Number(latitude)) && Math.abs(Number(latitude)) <= 90);
    ok(Number.isFinite(Number(longitude)) && Math.abs(Number(longitude)) <= 180);
  }
});
