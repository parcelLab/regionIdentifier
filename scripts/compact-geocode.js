const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function compactGeocode(points) {
  return points.map((point) => {
    const rounded = { ...point };
    for (const [key, limit] of [
      ['latitude', 90],
      ['longitude', 180],
    ]) {
      const value = Number(point[key]);
      assert(typeof point[key] === 'string' && point[key].trim() !== '', `${key} must be a string`);
      assert(Number.isFinite(value) && Math.abs(value) <= limit, `Invalid ${key}`);
      rounded[key] = String(Number(value.toPrecision(4)));
    }
    return rounded;
  });
}

if (require.main === module) {
  const directory = path.join(__dirname, '..', 'geocode');
  for (const name of fs.readdirSync(directory)) {
    if (!name.endsWith('.json')) continue;
    const file = path.join(directory, name);
    const points = compactGeocode(JSON.parse(fs.readFileSync(file, 'utf8')));
    fs.writeFileSync(file, `${JSON.stringify(points)}\n`);
  }
}

module.exports = compactGeocode;
