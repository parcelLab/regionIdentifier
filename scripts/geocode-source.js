const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function readSource(source) {
  return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(fs.readFileSync(source));
}

function parseTsv(text) {
  return text
    .replace(/(?:\r\n|\r|\n)$/, '')
    .split(/\r\n|\n|\r/)
    .map((line) => line.split('\t'));
}

function parseDelimited(text, delimiter) {
  const field = new RegExp(
    String.raw`(?:"((?:[^"]|"")*)"|((?!")[^${delimiter}\r\n]*))(${delimiter}|\r\n|\r|\n|$)`,
    'y',
  );
  const rows = [];
  let row = [];
  while (field.lastIndex < text.length) {
    const match = field.exec(text);
    assert(match, 'Invalid delimited field');
    const [, quoted, unquoted, separator] = match;
    row.push(quoted === undefined ? unquoted : quoted.replaceAll('""', '"'));
    if (separator === delimiter) continue;
    rows.push(row);
    row = [];
  }
  if (row.length > 0) rows.push([...row, '']);
  return rows;
}

function readTable(source, delimiter, columns, shouldStripBom = false) {
  const text = readSource(source);
  const [header, ...rows] = parseDelimited(
    shouldStripBom ? text.replace(/^\u{FEFF}/u, '') : text,
    delimiter,
  );
  assert(header, 'Missing header');
  const indices = columns.map((column) => {
    const index = header.indexOf(column);
    assert(index !== -1, `Missing column: ${column}`);
    return index;
  });
  return rows
    .filter((row) => row.length !== 1 || row[0] !== '')
    .map((row) => indices.map((index) => row[index]));
}

function coordinate(value, min, max) {
  assert.match(value?.trim() ?? '', /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i);
  const number = Number(value);
  assert(number >= min && number <= max, `Coordinate outside [${min}, ${max}]: ${value}`);
  return number;
}

function geoNamesEntries(
  rows,
  country,
  pattern,
  { bounds = [-90, 90, -180, 180], excluded = [] } = {},
) {
  const [minLatitude, maxLatitude, minLongitude, maxLongitude] = bounds;
  return rows.flatMap((row) => {
    assert.equal(row.length, 12);
    assert.equal(row[0], country);
    const zip = row[1];
    if (excluded.includes(zip)) return [];
    assert.match(zip, pattern);
    return [
      [
        zip,
        [
          coordinate(row[9], minLatitude, maxLatitude),
          coordinate(row[10], minLongitude, maxLongitude),
        ],
      ],
    ];
  });
}

function groupPoints(entries) {
  const groups = new Map();
  for (const [zip, point, key = point.join(',')] of entries) {
    if (!groups.has(zip)) groups.set(zip, new Map());
    const points = groups.get(zip);
    const existing = points.get(key);
    if (existing) {
      assert(
        existing[0] === point[0] && existing[1] === point[1],
        `Conflicting coordinates for ${zip}`,
      );
    } else {
      points.set(key, point);
    }
  }
  assert(groups.size > 0, 'Empty source');
  return groups
    .entries()
    .toArray()
    .toSorted(([first], [second]) => first.localeCompare(second, 'en'));
}

function mean(points, axis) {
  // Compensate for addition error before rounding the mean.
  let sum = 0;
  let correction = 0;
  for (const point of points) {
    const value = point[axis];
    const next = sum + value;
    correction += Math.abs(sum) >= Math.abs(value) ? sum - next + value : value - next + sum;
    sum = next;
  }
  return (sum + correction) / points.length;
}

function roundFixed(number, digits) {
  const fixed = number.toFixed(digits);
  // Python rounds exact halfway cases to even. toFixed rounds them away from zero.
  const binaryScaled = Math.abs(number) * 2 ** digits;
  if (binaryScaled % 1 === 0.5 && Number(fixed.at(-1)) % 2 === 1) {
    const factor = 10 ** digits;
    const lower = (Math.abs(number) * factor - 0.5) / factor;
    return `${number < 0 ? '-' : ''}${lower.toFixed(digits)}`;
  }
  return fixed;
}

function floatString(number) {
  if (Object.is(number, -0)) return '-0.0';
  if (Number.isSafeInteger(number)) return `${number}.0`;
  return Math.abs(number) < 0.0001
    ? number.toExponential().replace(/e-(\d)$/, 'e-0$1')
    : String(number);
}

function meanRows(
  groups,
  digits,
  { fixed = true, longitudeFirst = false, sortPoints = true } = {},
) {
  const firstAxis = longitudeFirst ? 1 : 0;
  const secondAxis = 1 - firstAxis;
  return groups.map(([zip, values]) => {
    const distinct = values.values().toArray();
    const points = sortPoints
      ? distinct.toSorted((a, b) => a[firstAxis] - b[firstAxis] || a[secondAxis] - b[secondAxis])
      : distinct;
    const latitude = roundFixed(mean(points, 0), digits);
    const longitude = roundFixed(mean(points, 1), digits);
    return {
      zip,
      latitude: fixed ? latitude : floatString(Number(latitude)),
      longitude: fixed ? longitude : floatString(Number(longitude)),
    };
  });
}

function writeRows(
  rows,
  country,
  target = path.join(__dirname, '..', 'geocode', `${country}.json`),
) {
  fs.writeFileSync(target, `${JSON.stringify(rows, null, 2)}\n`);
}

module.exports = {
  coordinate,
  floatString,
  geoNamesEntries,
  groupPoints,
  meanRows,
  parseDelimited,
  parseTsv,
  readSource,
  readTable,
  writeRows,
};
