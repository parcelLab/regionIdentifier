const assert = require('node:assert/strict');
const { coordinate, floatString, groupPoints, readTable, writeRows } = require('./geocode-source');

function angularDistance(first, second) {
  const radians = Math.PI / 180;
  const [lat1, lon1] = first.map((coordinate) => coordinate * radians);
  const [lat2, lon2] = second.map((coordinate) => coordinate * radians);
  const haversine =
    Math.sin((lat2 - lat1) / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2;
  return 2 * Math.asin(Math.sqrt(Math.min(1, haversine)));
}

function medoid(points) {
  // Sorted longitude and latitude break ties between source points.
  const sorted = points.toSorted(([lat1, lon1], [lat2, lon2]) => lon1 - lon2 || lat1 - lat2);
  let closest;
  let shortest = Infinity;
  for (const point of sorted) {
    const distance = sorted.reduce((sum, other) => sum + angularDistance(point, other), 0);
    if (!(distance < shortest)) {
      continue;
    }

    closest = point;
    shortest = distance;
  }
  return closest;
}

if (require.main === module) {
  const rows = readTable(process.argv[2], ';', ['Kantonskürzel', 'PLZ4', 'E', 'N'], true);
  const entries = [];
  for (const [canton, zip, longitude, latitude] of rows) {
    if (!canton) continue; // Liechtenstein has no Swiss canton.
    assert.match(zip, /^\d{4}$/);
    entries.push([zip, [coordinate(latitude, -90, 90), coordinate(longitude, -180, 180)]]);
  }
  const groups = groupPoints(entries);
  assert(groups.length > 3000);
  const result = groups.map(([zip, points]) => {
    const [latitude, longitude] = medoid(points.values().toArray());
    return { zip, latitude: floatString(latitude), longitude: floatString(longitude) };
  });
  writeRows(result, 'CHE');
  console.log(`${result.length} unique Swiss postal codes`);
}

module.exports = medoid;
