const {
  geoNamesEntries,
  groupPoints,
  meanRows,
  parseTsv,
  readSource,
  writeRows,
} = require('./geocode-source');

const rows = parseTsv(readSource(process.argv[2]));
const entries = geoNamesEntries(rows, 'DE', /^\d{5}$/, { bounds: [47, 56, 5, 16] });
const groups = groupPoints(entries);
const result = meanRows(groups, 6);
writeRows(result, 'DEU');
console.log(`Generated ${result.length} unique DEU postal codes`);
