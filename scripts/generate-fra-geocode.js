const assert = require('node:assert/strict');
const { coordinate, groupPoints, meanRows, readTable, writeRows } = require('./geocode-source');

function generate(rows) {
  const missing = new Set();
  const entries = [];
  for (const [commune, zip, latitude, longitude] of rows) {
    // Keep metropolitan France and the five overseas departments.
    assert(commune);
    if (/^9[789]/.test(commune) && !/^97[1-46]/.test(commune)) continue;
    assert.match(zip, /^\d{5}$/);
    if (!latitude || !longitude) {
      missing.add(zip);
      continue;
    }
    entries.push([zip, [coordinate(latitude, -90, 90), coordinate(longitude, -180, 180)], commune]);
  }
  const groups = groupPoints(entries);
  for (const [zip] of groups) missing.delete(zip);
  return {
    result: meanRows(groups, 6, { sortPoints: false }),
    missing: missing
      .values()
      .toArray()
      .toSorted((a, b) => a.localeCompare(b)),
  };
}

if (require.main === module) {
  const rows = readTable(process.argv[2], ',', [
    'code_commune_insee',
    'code_postal',
    'latitude',
    'longitude',
  ]);
  const { result, missing } = generate(rows);
  writeRows(result, 'FRA');
  console.log(`${result.length} unique postal codes; no coordinates: [${missing.join(', ')}]`);
}

module.exports = generate;
