# GBR postal geocoding

## Source and license

- Source: [GeoNames GB.zip](https://download.geonames.org/export/zip/GB.zip), `GB.txt`.
- Attribution: GeoNames, <https://www.geonames.org/>. Data is licensed under
  [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/).
  This derived file groups source rows and changes coordinate selection.
- Retrieved: 2026-11-04. The download index reports 2026-11-04 03:53 CET.
  This is an export date, not a verified date for each postal record.
- [Source documentation](https://download.geonames.org/export/zip/readme.txt)
  describes estimated WGS84 coordinates and first-part UK postcodes. It provides
  no accuracy, timeliness, or completeness warranty. The full-code archive is
  a separate product with a Royal Mail notice; this change uses only `GB.zip`.

## Coverage and precision

The input has 27,450 rows and 3,002 distinct outward codes (postal districts).
The output has 3,002 records and 3,002 unique codes. It includes England,
Scotland, Wales, Northern Ireland (`BT`), and island districts such as `ZE2`
and `TR21`. This does not establish complete current national coverage.
GeoNames also groups 23 Crown dependency districts (`GY`, `IM`, `JE`) under
`GB`. The legacy GBR file already includes such districts. This source grouping
is retained for compatibility; it is not a claim that they are part of the UK.
Missing, special, new, or unlisted districts return `undefined`.

For each district, remove duplicate numeric latitude/longitude pairs, sort the
remaining pairs, and take the arithmetic mean of each coordinate. Round to four
decimal places and retain strings for compatibility. Each distinct point has
one vote; repeated locality rows do not increase its weight. This is a
representative point, not an address-weighted or polygon centroid. It can lie
between settlements or over water. GeoNames can also estimate input points
from neighbouring codes. Four decimals do not imply address-level accuracy.

This replaces the previous first-row selection, so existing district coordinates
can change. It adds 17 districts. District lookup cannot measure distances within
a district: two different full postcodes can return the same point. In large
rural or island districts, errors can be tens of kilometres. Do not use these
points as proof of a parcel's physical location or for fraud decisions.

## Input and compatibility

GBR accepts an outward code or a full postcode, with or without the separator,
in either case. Surrounding whitespace and whitespace between outward and
inward codes are accepted. Malformed suffixes return `undefined`. A syntactically
valid inward code is not checked against a full-postcode directory.
The result remains `[longitude, latitude]` with string values. Other country
normalization, exports, types, and allowlist entries are unchanged.

[ONS postal geography](https://www.ons.gov.uk/methodology/geography/ukgeographies/postalgeography)
confirms the 2–4 character outward code and three-character inward code.
The following primary sources confirm representative locality/postcode matches;
they do not independently certify the numerical points:

- Urban: [UK Parliament](https://www.parliament.uk/visiting/access/directions/)
  identifies Westminster, London, `SW1A 0AA`. The point is in Westminster.
- Northern Ireland: [Belfast City Council](https://www.belfastcity.gov.uk/things-to-do/city-hall/visitor-information)
  gives Belfast City Hall as `BT1 5GS`. The source point is in Belfast.
- Rural/island edge: [Shetland Islands Council rural settlement list](https://www.shetland.gov.uk/downloads/file/7214/rural-settlement-list-postcodes-)
  includes Bridge of Walls, `ZE2 9NS`. The representative point is in the
  Shetland area; it is not the location of that specific settlement.
- Island edge: [Isles of Scilly Council planning application](https://www.scilly.gov.uk/sites/default/files/planning-apps/planning-application-p/17/111/P-17-111%20Application%20Form%20Web.pdf)
  identifies Hugh Town, `TR21 0PT`. The point is in Hugh Town.

## Rebuild and checks

Download and extract `GB.txt`, then run from the repository root:

```sh
node scripts/build-gbr-geocode.js /path/to/GB.txt
npm run geocode:compact
npm test
npm run lint
npm run format:check
npm run validate:data
```

The generator checks country, row shape, district format, finite coordinates,
and coordinate ranges. Tests check duplicate weighting, input-order
independence, and invalid-input rejection.
Offline tests execute the actual lookup for every district, check unique codes
and coordinate types/ranges, and cover input formats, misses, urban, rural,
Northern Ireland, and island cases. They do not establish a measured error bound.
