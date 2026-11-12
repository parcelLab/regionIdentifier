const {
  geoNamesEntries,
  groupPoints,
  meanRows,
  parseDelimited,
  readSource,
  writeRows,
} = require('./geocode-source');

const rows = parseDelimited(readSource(process.argv[2]), '\t');
const entries = geoNamesEntries(rows, 'PT', /^\d{4}-\d{3}$/);
const groups = groupPoints(entries);
const result = meanRows(groups, 6, { fixed: false });
writeRows(result, 'PRT', 'geocode/PRT.json');
