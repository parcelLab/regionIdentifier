const assert = require('node:assert/strict');
const {
  geoNamesEntries,
  groupPoints,
  meanRows,
  parseDelimited,
  readSource,
  writeRows,
} = require('./geocode-source');

assert(process.argv[3], 'Expected an output path');
const rows = parseDelimited(readSource(process.argv[2]), '\t');
const entries = geoNamesEntries(rows, 'AT', /^\d{4}$/);
const groups = groupPoints(entries);
const result = meanRows(groups, 4);
writeRows(result, 'AUT', process.argv[3]);
