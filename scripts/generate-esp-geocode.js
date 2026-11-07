const {
  geoNamesEntries,
  groupPoints,
  meanRows,
  parseTsv,
  readSource,
  writeRows,
} = require('./geocode-source');

const rows = parseTsv(readSource(process.argv[2]));
const entries = geoNamesEntries(rows, 'ES', /^\d{5}$/);
const groups = groupPoints(entries);
const result = meanRows(groups, 4);
writeRows(result, 'ESP');
