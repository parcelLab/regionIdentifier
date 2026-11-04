const assert = require('node:assert/strict');
const fs = require('node:fs');

// GeoNames LT.txt only; average distinct points to avoid weighting repeated localities.
function generateLtuGeocode(text) {
  const codes = new Map();
  for (const line of text.trim().split(/\r?\n/)) {
    const fields = line.split('\t');
    assert.equal(fields.length, 12);
    assert.equal(fields[0], 'LT');
    const zip = fields[1];
    assert.match(zip, /^\d{5}$/);
    assert.notEqual(fields[9].trim(), '');
    assert.notEqual(fields[10].trim(), '');
    const latitude = Number(fields[9]);
    const longitude = Number(fields[10]);
    assert(Number.isFinite(latitude) && latitude >= -90 && latitude <= 90);
    assert(Number.isFinite(longitude) && longitude >= -180 && longitude <= 180);
    if (!codes.has(zip)) codes.set(zip, new Map());
    codes.get(zip).set(`${latitude},${longitude}`, { latitude, longitude });
  }
  return [...codes]
    .toSorted(([first], [second]) => first.localeCompare(second))
    .map(([zip, points]) => {
      const values = points
        .values()
        .toArray()
        .toSorted(
          (first, second) => first.latitude - second.latitude || first.longitude - second.longitude,
        );
      return {
        zip,
        latitude: String(
          Number(
            (values.reduce((sum, point) => sum + point.latitude, 0) / values.length).toFixed(6),
          ),
        ),
        longitude: String(
          Number(
            (values.reduce((sum, point) => sum + point.longitude, 0) / values.length).toFixed(6),
          ),
        ),
      };
    });
}

if (require.main === module) {
  const data = generateLtuGeocode(fs.readFileSync(process.argv[2], 'utf8'));
  process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
}

module.exports = generateLtuGeocode;
