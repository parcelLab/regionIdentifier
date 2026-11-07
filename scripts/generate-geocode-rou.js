const assert = require('node:assert/strict');
const {
  geoNamesEntries,
  groupPoints,
  meanRows,
  parseTsv,
  readSource,
  writeRows,
} = require('./geocode-source');

const rows = parseTsv(readSource(process.argv[2]));
const entries = geoNamesEntries(rows, 'RO', /^\d{6}$/);
const groups = groupPoints(entries);
const result = meanRows(groups, 6, { fixed: false });
assert.equal(result.length, 37914);
assert.deepEqual(
  result.find(({ zip }) => zip === '510002'),
  {
    zip: '510002',
    latitude: '46.08405',
    longitude: '23.5695',
  },
);
writeRows(result, 'ROU', 'geocode/ROU.json');
