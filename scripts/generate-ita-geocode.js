const assert = require('node:assert/strict');
const fs = require('node:fs');

// Use each distinct source point once; select the point nearest their arithmetic mean.
function generate(text) {
  const codes = new Map();
  for (const line of text.trim().split('\n')) {
    const fields = line.split('\t');
    const [country, zip] = fields;
    const latitude = Number(fields[9]);
    const longitude = Number(fields[10]);
    assert.equal(country, 'IT');
    assert.match(zip, /^\d{5}$/);
    assert.ok(fields[9] && fields[10]);
    assert.ok(Number.isFinite(latitude) && Math.abs(latitude) <= 90);
    assert.ok(Number.isFinite(longitude) && Math.abs(longitude) <= 180);
    if (!codes.has(zip)) codes.set(zip, new Map());
    codes.get(zip).set(`${latitude},${longitude}`, { latitude, longitude });
  }
  return [...codes]
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([zip, values]) => {
      const points = values
        .values()
        .toArray()
        .toSorted((a, b) => a.latitude - b.latitude || a.longitude - b.longitude);
      const latitude = points.reduce((sum, point) => sum + point.latitude, 0) / points.length;
      const longitude = points.reduce((sum, point) => sum + point.longitude, 0) / points.length;
      const scale = Math.cos((latitude * Math.PI) / 180);
      const distance = (point) =>
        (point.latitude - latitude) ** 2 + ((point.longitude - longitude) * scale) ** 2;
      let selected = points[0];
      for (const point of points) {
        if (distance(point) < distance(selected)) selected = point;
      }
      return { zip, latitude: String(selected.latitude), longitude: String(selected.longitude) };
    });
}

if (require.main === module) {
  const result = generate(fs.readFileSync(process.argv[2], 'utf8'));
  fs.writeFileSync(process.argv[3], `${JSON.stringify(result, null, 2)}\n`);
}
module.exports = generate;
