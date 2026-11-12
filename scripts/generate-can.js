const assert = require('node:assert/strict');
const {
  geoNamesEntries,
  groupPoints,
  meanRows,
  parseDelimited,
  readSource,
  writeRows,
} = require('./geocode-source');

const rows = parseDelimited(readSource(process.argv[2]), '\t');
const excluded = ['H0H', 'T3T 0E5', 'V3Y 0H2'];
const entries = geoNamesEntries(rows, 'CA', /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]$/, {
  excluded,
});
const groups = groupPoints(entries);
assert.equal(rows.length, 1657);
assert.equal(groups.length, 1650);
assert.deepEqual(
  rows
    .map((row) => row[1])
    .filter((zip) => excluded.includes(zip))
    .toSorted((a, b) => a.localeCompare(b)),
  excluded,
);
writeRows(meanRows(groups, 6, { fixed: false }), 'CAN');
