const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs');

function center(polygons) {
  let area = 0;
  let x = 0;
  let y = 0;
  for (const polygon of polygons) {
    for (const [index, ring] of polygon.entries()) {
      let a = 0;
      let cx = 0;
      let cy = 0;
      for (let i = 0; i < ring.length - 1; i++) {
        const [x1, y1] = ring[i];
        const [x2, y2] = ring[i + 1];
        const cross = x1 * y2 - x2 * y1;
        a += cross;
        cx += (x1 + x2) * cross;
        cy += (y1 + y2) * cross;
      }
      assert(Number.isFinite(a) && a !== 0);
      const weight = Math.abs(a) * (index === 0 ? 1 : -1);
      area += weight;
      x += (cx / (3 * a)) * weight;
      y += (cy / (3 * a)) * weight;
    }
  }
  assert(area > 0);
  return [x / area, y / area];
}

function build(data) {
  assert.equal(data.crs.properties.name, 'urn:ogc:def:crs:EPSG::4326');
  assert.equal(data.numberReturned, 3018);
  assert.equal(data.numberMatched, 3018);
  assert.equal(data.features.length, 3018);
  const seen = new Set();
  return data.features
    .map(({ properties, geometry }) => {
      const zip = properties.posti_alue;
      assert.equal(properties.vuosi, 2026);
      assert(typeof zip === 'string' && /^\d{5}$/.test(zip) && !seen.has(zip));
      assert(['Polygon', 'MultiPolygon'].includes(geometry.type));
      const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
      const [longitude, latitude] = center(polygons);
      assert(Number.isFinite(longitude) && longitude > 19 && longitude < 32);
      assert(Number.isFinite(latitude) && latitude > 59 && latitude < 71);
      seen.add(zip);
      return { zip, latitude: latitude.toFixed(6), longitude: longitude.toFixed(6) };
    })
    .toSorted((a, b) => a.zip.localeCompare(b.zip));
}

if (require.main === module) {
  const source = fs.readFileSync(process.argv[2]);
  const rows = build(JSON.parse(source));
  fs.writeFileSync('geocode/FIN.json', `${JSON.stringify(rows, null, 2)}\n`);
  console.log(
    `${rows.length} postal areas; source SHA-256: ${createHash('sha256').update(source).digest('hex')}`,
  );
}

module.exports = { build, center };
