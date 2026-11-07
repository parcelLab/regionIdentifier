const assert = require('node:assert/strict');
const { coordinate, groupPoints, meanRows, readTable, writeRows } = require('./geocode-source');

const rows = readTable(process.argv[2], ';', ['code_postal', 'lon_wgs84', 'lat_wgs84'], true);
const entries = rows.map(([zip, longitude, latitude]) => {
  assert.match(zip, /^\d{4}$/);
  return [zip, [coordinate(latitude, 49.4, 50.2), coordinate(longitude, 5.7, 6.6)]];
});
writeRows(meanRows(groupPoints(entries), 6, { longitudeFirst: true }), 'LUX');
