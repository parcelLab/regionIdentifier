const {
  geoNamesEntries,
  groupPoints,
  meanRows,
  parseTsv,
  readSource,
  writeRows,
} = require('./geocode-source');

const rows = parseTsv(readSource(process.argv[2]));
const entries = geoNamesEntries(rows, 'JP', /^\d{3}-\d{4}$/);
for (const entry of entries) entry[0] = entry[0].replace('-', '');
const groups = groupPoints(entries);
const result = meanRows(groups, 4, { fixed: false });
writeRows(result, 'JPN');
