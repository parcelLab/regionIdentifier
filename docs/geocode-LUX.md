# Luxembourg postal geocoding

## Source and license

- Producer: Administration du cadastre et de la topographie (ACT), Luxembourg.
- Dataset: [Adresses géoréférencées (BD-Adresses)](https://data.public.lu/en/datasets/adresses-georeferencees-bd-adresses/).
- Input: [addresses.csv, 2026-11-02 snapshot](https://download.data.public.lu/resources/adresses-georeferencees-bd-adresses/20261102-033122/addresses.csv).
- Retrieved: 2026-11-04. Dataset/resource update: 2026-11-02.
- License: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/), as stated in the current dataset license field. This data retains its CC0 terms independently of the package license. Older discussion comments mention ODbL; the current publisher metadata explicitly identifies CC0.
- Input MD5: `946114c1a24b49471b580bc225e4cb25`, matches the publisher.
- Input SHA-256: `f163ed856200eedd8b501da2d7787e01ee373be1a55a4d79abcf57c96982a99c`.

## Coverage and method

The input contains 179,768 address rows, 179,735 distinct postal-code/coordinate pairs, and 4,200 distinct four-digit postal codes. The output has 4,200 records. It uses the source's WGS84 longitude and latitude fields, not its LUREF coordinates.

For each postal code, remove repeated coordinate pairs, sort the remaining pairs, and calculate the arithmetic mean of each coordinate. This gives equal weight to each distinct address position and avoids weighting by duplicate rows or addresses at the same position. Round to six decimal places and store strings to match existing geocode results. This is a representative mean of available address positions, not an official postal-area centroid or the first locality.

Rebuild with Node.js:

```sh
node scripts/generate-lux-geocode.js /path/to/addresses.csv
npm run geocode:compact
```

The generator checks postal formats, finite coordinates, global coordinate ranges, and Luxembourg bounds. Tests verify duplicate removal, order independence, and leading-zero preservation.

## Lookup behavior and checks

The existing `lib/geocode` lookup accepts exact four-digit codes and the existing space-separated locality suffix. Examples are `1135` and `9999 Wemperhardt`. Country identifiers use the existing resolver (`LUX`, `LU`, `Luxembourg`). No country-specific normalization is needed. Country-prefixed codes such as `L-1135`, short codes, and unknown codes return `undefined`. No padding or fallback point is added.

Checks against the primary source CSV:

| Code | Source locality | Distinct positions | Representative longitude, latitude |
| ---- | --------------- | -----------------: | ---------------------------------- |
| 1135 | Luxembourg      |                 26 | 6.112139, 49.611600                |
| 1420 | Luxembourg      |                239 | 6.108114, 49.610090                |
| 9755 | Hupperdange     |                138 | 6.058041, 50.095327                |
| 9999 | Wemperhardt     |                 21 | 6.053220, 50.153582                |

The producer's dataset page also supplies a primary-source address example for `1135 Luxembourg` near longitude 6.11255, latitude 49.61061. The tests execute the actual lookup for the examples above and validate every output record.

## Accuracy limits

ACT states that the dataset is a subset of the national address register, some official addresses are not georeferenced, and completeness is not guaranteed. Address points can come from manual placement, parcel centers, or the largest building on a parcel. They do not identify building entrances. Postal codes without georeferenced addresses, including any special delivery codes absent from the file, are not added.

Coverage is therefore source coverage, not verified complete national postal coverage. Six decimal places describe storage precision, not positional accuracy. The representative point can differ from a delivery address or return scan location. Use it for approximate postal-code distance only; no route distance or fraud decision is provided.
