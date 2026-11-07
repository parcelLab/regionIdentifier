const assert = require('node:assert/strict');
const { readFileSync, writeFileSync } = require('node:fs');

// GeoNames US.txt only; see docs/geocode-USA.md for source and limits.
const points = new Map();
const lines = readFileSync(process.argv[2], 'utf8').trimEnd().split('\n');
for (const line of lines) {
  const fields = line.split('\t');
  const [country, zip] = fields;
  const latitude = Number(fields[9]);
  const longitude = Number(fields[10]);
  assert.equal(country, 'US');
  assert.match(zip, /^\d{5}$/);
  assert(fields[9] && fields[10]);
  assert(Number.isFinite(latitude) && Math.abs(latitude) <= 90);
  assert(Number.isFinite(longitude) && Math.abs(longitude) <= 180);
  if (!points.has(zip)) points.set(zip, new Map());
  points.get(zip).set(`${latitude},${longitude}`, { latitude, longitude });
}
const result = points
  .entries()
  .toArray()
  .toSorted(([left], [right]) => left.localeCompare(right))
  .map(([zip, locations]) => {
    const unique = locations.values().toArray();
    const mean = (key) =>
      String(
        Number((unique.reduce((sum, point) => sum + point[key], 0) / unique.length).toFixed(6)),
      );
    return { zip, latitude: mean('latitude'), longitude: mean('longitude') };
  });
assert.equal(result.length, 41488);
assert.deepEqual(
  result.find((point) => point.zip === '96860'),
  {
    zip: '96860',
    latitude: '21.3304',
    longitude: '-157.92255',
  },
);
writeFileSync('geocode/USA.json', `${JSON.stringify(result, null, 2)}\n`);
