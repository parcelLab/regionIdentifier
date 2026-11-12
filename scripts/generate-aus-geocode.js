const assert = require('node:assert/strict');
const fs = require('node:fs');

function generateAusGeocode(text) {
  const postcodes = new Map();
  for (const line of text.trim().split(/\r?\n/)) {
    const fields = line.split('\t');
    assert.equal(fields.length, 12);
    const [country, zip] = fields;
    const latitude = Number(fields[9]);
    const longitude = Number(fields[10]);
    assert.equal(country, 'AU');
    assert.match(zip, /^\d{4}$/);
    assert(fields[9] !== '' && Number.isFinite(latitude) && Math.abs(latitude) <= 90);
    assert(fields[10] !== '' && Number.isFinite(longitude) && Math.abs(longitude) <= 180);
    assert.match(fields[11], /^[1-6]$/);
    // Exclude estimated points, including misplaced external-island postcodes.
    if (Number(fields[11]) < 4) continue;
    if (!postcodes.has(zip)) postcodes.set(zip, new Map());
    postcodes.get(zip).set(`${latitude},${longitude}`, [latitude, longitude]);
  }
  return [...postcodes]
    .toSorted(([first], [second]) => first.localeCompare(second))
    .map(([zip, points]) => {
      const distinct = points
        .values()
        .toArray()
        .toSorted(([a, b], [c, d]) => a - c || b - d);
      return {
        zip,
        latitude: (distinct.reduce((sum, point) => sum + point[0], 0) / distinct.length).toFixed(6),
        longitude: (distinct.reduce((sum, point) => sum + point[1], 0) / distinct.length).toFixed(
          6,
        ),
      };
    });
}

if (require.main === module) {
  const rows = generateAusGeocode(fs.readFileSync(process.argv[2], 'utf8'));
  assert(rows.length > 0);
  process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
}
module.exports = generateAusGeocode;
