# Japan postal geocodes

## Source and license

- Source: [GeoNames Japan postal file](https://download.geonames.org/export/zip/JP.zip), attributed to [GeoNames](https://www.geonames.org/).
- License: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/), as stated in the [postal file readme](https://download.geonames.org/export/zip/readme.txt). Commercial use and redistribution are permitted with attribution. Retain this notice with the data. The package's legacy CC BY 3.0 label does not replace this dataset's CC BY 4.0 license.
- Retrieved: 2026-11-04. The download index and archive entry date are 2026-11-04 03:54. This is an export date, not a guarantee that postal assignments were checked on that date. No underlying survey date is supplied.
- Extracted `JP.txt` SHA-256: `8b5d3ce93f1f1d2129b415b52ca7cbb187a64de9067a06a717ae93253ffc21c6`.
- Changes: retain postal code and estimated WGS84 point, remove the hyphen, sort, and combine duplicate codes as described below. Source names and administrative fields are omitted.

## Coverage and precision

The source has 146,883 rows, 142,577 unique full postal codes, and 47 distinct first-level administrative codes. The output has 142,577 records, one per postal code. Leading zeros are retained. This is source coverage, not a claim of complete or current national coverage. Business-specific, new, changed, and missing codes can be absent. No prefix or region-center fallback is used.

GeoNames calls the coordinates **estimated**. It can infer points from place names or neighboring postal codes. Many JPN codes share a locality point; the source often has no accuracy value. Four decimal places are storage precision, not measured positional accuracy. These points are not postal-area centroids, building locations, or verified scan locations. Rural and island errors can be large. No measured distance-error bound is available; do not use this data for precise short-distance conclusions or fraud decisions.

For each postal code, the generator removes duplicate coordinate pairs and takes the arithmetic mean of the distinct WGS84 latitude/longitude pairs, rounded to four decimals. There are 16 codes with multiple distinct pairs. This deterministic representative point avoids weighting repeated source rows. It can fall between settlements and is not a geometric or population-weighted centroid. No missing point is fabricated.

## Lookup behavior

`coordinates('JPN', '1000001')` and `coordinates('JP', '100-0001')` return string values `[longitude, latitude]`, consistent with legacy datasets. Only seven ASCII digits or `DDD-DDDD` are accepted. Embedded spaces, prefixes, extra text, and unknown codes return `undefined`. Country resolution retains the existing shared behavior. Other countries are unchanged.

## Checks and reproduction

Download and extract the source, then run from the repository root:

```sh
curl -fSL https://download.geonames.org/export/zip/JP.zip -o /tmp/JP.zip
unzip -p /tmp/JP.zip JP.txt > /tmp/JP.txt
python3 scripts/build-jpn-geocode.py /tmp/JP.txt
npx prettier --write geocode/JPN.json
npm test
npm run lint
npm run format:check
npm run validate:data
```

The generator asserts country, field count, postal format, finite coordinate ranges, unique output codes, and duplicate-independent averaging. Offline tests execute the lookup and check the full dataset shape and count. A future export can change the expected count and points; review the source before updating these tests.

Representative postal assignments were checked against Japan Post on 2026-11-04:

| Case                                          | Postal code | GeoNames point (longitude, latitude) | Primary postal reference                                                                                               |
| --------------------------------------------- | ----------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Urban: Chiyoda, Tokyo                         | 100-0001    | 139.7521, 35.6841                    | [Japan Post, Chiyoda](https://www.post.japanpost.jp/cgi-zip/zipcode.php?city=1131010&cmp=1&pref=13)                    |
| Rural island, leading zero: Kafukamura, Rebun | 097-1201    | 141.0412, 45.3021                    | [Japan Post, Nairo office notice](https://www.post.japanpost.jp/newsrelease/storeinformation/detail/index.php?id=5441) |
| Western island: Yonaguni                      | 907-1801    | 123.0, 24.4667                       | [Japan Post, Yonaguni](https://www.post.japanpost.jp/cgi-zip/zipcode.php?city=1473820&pref=47)                         |

These references confirm the code-to-place assignments. The coordinates are checked against the original GeoNames rows and for plausible location, not independently surveyed by Japan Post. The tests also check the distinct-point average for 069-1334: 141.6888, 43.0115. Unknown 000-0000 has no result.
