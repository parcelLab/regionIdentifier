const {
  geoNamesEntries,
  groupPoints,
  meanRows,
  parseTsv,
  readSource,
  writeRows,
} = require('./geocode-source');

const rows = parseTsv(readSource(process.argv[2]));
const entries = geoNamesEntries(rows, 'BE', /^\d{4}$/);
const groups = groupPoints(entries);
const result = meanRows(groups, 6, { fixed: false });
writeRows(result, 'BEL');
