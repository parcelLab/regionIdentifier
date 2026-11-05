const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Compensate summation error before rounding district averages.
function mean(points, index) {
  let sum = 0;
  let correction = 0;
  for (const point of points) {
    const value = point[index];
    const next = sum + value;
    correction += Math.abs(sum) >= Math.abs(value) ? sum - next + value : value - next + sum;
    sum = next;
  }
  return ((sum + correction) / points.length).toFixed(4);
}

function build(text) {
  const districts = new Map();
  for (const line of text.replace(/\r?\n$/, '').split(/\r?\n/)) {
    const fields = line.split('\t');
    assert(fields.length === 12 && fields[0] === 'GB', 'Expected GeoNames GB rows');
    const zip = fields[1];
    assert.match(zip, /^[A-Z]{1,2}\d[A-Z\d]?$/);
    const latitude = Number(fields[9]);
    const longitude = Number(fields[10]);
    assert(fields[9].trim() && fields[10].trim());
    assert(Number.isFinite(latitude) && Math.abs(latitude) <= 90);
    assert(Number.isFinite(longitude) && Math.abs(longitude) <= 180);
    if (!districts.has(zip)) districts.set(zip, new Map());
    districts.get(zip).set(`${latitude},${longitude}`, [latitude, longitude]);
  }
  assert(districts.size, 'Empty input');
  return districts
    .keys()
    .toArray()
    .toSorted((a, b) => a.localeCompare(b))
    .map((zip) => {
      const points = districts
        .get(zip)
        .values()
        .toArray()
        .toSorted(([a, b], [c, d]) => a - c || b - d);
      return {
        zip,
        latitude: mean(points, 0),
        longitude: mean(points, 1),
      };
    });
}

if (require.main === module) {
  const result = build(fs.readFileSync(process.argv[2], 'utf8'));
  fs.writeFileSync(
    path.join(__dirname, '..', 'geocode', 'GBR.json'),
    `${JSON.stringify(result, null, 2)}\n`,
  );
}

module.exports = build;
