const {
  geoNamesEntries,
  groupPoints,
  meanRows,
  parseDelimited,
  readSource,
  writeRows,
} = require('./geocode-source');

const rows = parseDelimited(readSource(process.argv[2]), '\t');
const entries = geoNamesEntries(rows, 'MX', /^\d{5}$/);
// 23300 includes misplaced La Paz points. See docs/geocode-MEX.md.
const groups = groupPoints(entries.filter(([zip]) => zip !== '23300'));
const result = meanRows(groups, 6);
writeRows(result, 'MEX');
console.log(`Wrote ${result.length} unique postal codes`);
