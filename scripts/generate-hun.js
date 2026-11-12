const assert = require('node:assert/strict');
const {
  geoNamesEntries,
  groupPoints,
  meanRows,
  parseTsv,
  readSource,
  writeRows,
} = require('./geocode-source');

assert(process.argv[3], 'Expected an output path');
const rows = parseTsv(readSource(process.argv[2]));
const entries = geoNamesEntries(rows, 'HU', /^[1-9]\d{3}$/, { bounds: [45, 49, 16, 23] });
const groups = groupPoints(entries);
const result = meanRows(groups, 4);
writeRows(result, 'HUN', process.argv[3]);
console.log(`${rows.length} source rows; ${result.length} unique postal codes`);
