const assert = require('node:assert/strict');
const fs = require('node:fs');

function generate(text) {
  const pointsByZip = new Map();
  for (const line of text.trim().split('\n')) {
    const fields = line.split('\t');
    assert.equal(fields.length, 12);
    assert.equal(fields[0], 'CZ');
    assert.match(fields[1], /^\d{3} \d{2}$/);
    const zip = fields[1].replace(' ', '');
    const latitude = Number(fields[9]);
    const longitude = Number(fields[10]);
    assert(fields[9] && fields[10]);
    assert(Number.isFinite(latitude) && latitude >= 48 && latitude <= 52);
    assert(Number.isFinite(longitude) && longitude >= 12 && longitude <= 19);
    if (!pointsByZip.has(zip)) pointsByZip.set(zip, new Map());
    pointsByZip.get(zip).set(`${latitude},${longitude}`, [latitude, longitude]);
  }
  return [...pointsByZip]
    .toSorted(([first], [second]) => first.localeCompare(second))
    .map(([zip, points]) => {
      const values = points
        .values()
        .toArray()
        .toSorted(([a, b], [c, d]) => a - c || b - d);
      return {
        zip,
        latitude: (values.reduce((sum, point) => sum + point[0], 0) / values.length).toFixed(6),
        longitude: (values.reduce((sum, point) => sum + point[1], 0) / values.length).toFixed(6),
      };
    });
}

if (require.main === module) {
  const data = generate(fs.readFileSync(process.argv[2], 'utf8'));
  process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
}
module.exports = generate;
