const {
  geoNamesEntries,
  groupPoints,
  meanRows,
  parseTsv,
  readSource,
  writeRows,
} = require('./geocode-source');

const rows = parseTsv(readSource(process.argv[2]));
const entries = geoNamesEntries(rows, 'PL', /^\d{2}-\d{3}$/);
const groups = groupPoints(entries);
const result = meanRows(groups, 6, { longitudeFirst: true });
writeRows(result, 'POL');
console.log(`Wrote ${result.length} unique postcodes`);
