const assert = require('node:assert/strict');
const fs = require('node:fs');

// Inputs: GeoNames NO.txt (UTF-8), Bring postcode register (Windows-1252).
const [geonamesPath, bringPath] = process.argv.slice(2);
assert(geonamesPath && bringPath, 'Provide NO.txt and the Bring register paths');
const currentCodes = new Set(
  fs
    .readFileSync(bringPath, 'latin1')
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split('\t', 1)[0]),
);
const points = new Map();
for (const line of fs.readFileSync(geonamesPath, 'utf8').trim().split(/\r?\n/)) {
  const fields = line.split('\t');
  const zip = fields[1];
  assert.equal(fields[0], 'NO');
  assert.match(zip, /^\d{4}$/);
  assert(!points.has(zip), `Duplicate postcode ${zip}`);
  const latitude = fields[9];
  const longitude = fields[10];
  assert(latitude && longitude);
  assert(Number.isFinite(Number(latitude)) && Math.abs(Number(latitude)) <= 90);
  assert(Number.isFinite(Number(longitude)) && Math.abs(Number(longitude)) <= 180);
  points.set(zip, { zip, latitude, longitude });
}
const data = points
  .values()
  .filter(({ zip }) => currentCodes.has(zip))
  .toArray()
  .toSorted((first, second) => first.zip.localeCompare(second.zip));
assert.equal(points.size, 5132);
assert.equal(currentCodes.size, 5112);
assert.equal(data.length, 5092);
fs.writeFileSync(`${__dirname}/../geocode/NOR.json`, `${JSON.stringify(data, null, 2)}\n`);
