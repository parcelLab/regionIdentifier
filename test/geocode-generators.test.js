const { deepEqual, equal, throws } = require('node:assert/strict');
const { it } = require('node:test');
const buildGbr = require('../scripts/build-gbr-geocode');
const { build: buildFin, center } = require('../update/fin');

it('GBR generation ignores duplicate weighting and input order, and rejects invalid rows', () => {
  const row = 'GB\tAB1\tPlace\t\t\t\t\t\t\t57\t-2\t4';
  const other = row.replace('57\t-2', '59\t-4');
  deepEqual(buildGbr(`${row}\n${row}\n${other}`), [
    { zip: 'AB1', latitude: '58.0000', longitude: '-3.0000' },
  ]);
  deepEqual(buildGbr(`${row}\n${other}`), buildGbr(`${other}\n${row}`));
  const nearRoundingBoundary = [
    [50.824, -0.3232],
    [50.8303, -0.3257],
    [50.8288, -0.3225],
    [50.8346, -0.3424],
  ].map(([latitude, longitude]) => row.replace('57\t-2', () => `${latitude}\t${longitude}`));
  equal(buildGbr(nearRoundingBoundary.join('\n'))[0].longitude, '-0.3285');
  deepEqual(buildGbr(`${row.slice(0, -1)}\n`), buildGbr(row));
  for (const bad of [
    '',
    row.replace('57\t-2', 'nan\t-2'),
    row.replace('57\t-2', '91\t-2'),
    row.replace('57\t-2', '\t-2'),
    row.replace('GB', 'FR'),
  ]) {
    throws(() => buildGbr(bad));
  }
});

it('FIN centroids subtract holes and weight disconnected areas independently of ring direction', () => {
  const square = [
    [0, 0],
    [2, 0],
    [2, 2],
    [0, 2],
    [0, 0],
  ];
  const hole = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
    [0, 0],
  ];
  deepEqual(center([[square]]), [1, 1]);
  deepEqual(center([[square, hole]]), [7 / 6, 7 / 6]);
  deepEqual(center([[square.toReversed(), hole.toReversed()]]), [7 / 6, 7 / 6]);
  deepEqual(center([[square], [square.map(([x, y]) => [x + 4, y])]]), [3, 1]);
  throws(() =>
    center([
      [
        [
          [0, 0],
          [1, 0],
          [0, 0],
        ],
      ],
    ]),
  );
});

it('FIN generation validates the layer, year, postal codes, geometry, and coordinate bounds', () => {
  const data = {
    crs: { properties: { name: 'urn:ogc:def:crs:EPSG::4326' } },
    numberReturned: 3018,
    numberMatched: 3018,
    features: Array.from({ length: 3018 }, (_, i) => ({
      properties: { posti_alue: String(i).padStart(5, '0'), vuosi: 2026 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [24, 60],
            [26, 60],
            [26, 62],
            [24, 62],
            [24, 60],
          ],
        ],
      },
    })),
  };
  const result = buildFin(data);
  equal(result.length, 3018);
  deepEqual(result[0], { zip: '00000', latitude: '61.000000', longitude: '25.000000' });
  for (const mutate of [
    (d) => {
      d.crs.properties.name = 'EPSG:3067';
    },
    (d) => {
      d.numberReturned = 1;
    },
    (d) => {
      d.features.pop();
    },
    (d) => {
      d.features[0].properties.vuosi = 2025;
    },
    (d) => {
      d.features[0].properties.posti_alue = '00001';
    },
    (d) => {
      d.features[0].geometry.type = 'Point';
    },
    (d) => {
      d.features[0].geometry.coordinates[0][0] = [NaN, 60];
    },
  ]) {
    const invalid = structuredClone(data);
    mutate(invalid);
    throws(() => buildFin(invalid));
  }
});
