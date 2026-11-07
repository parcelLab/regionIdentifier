# Germany postal-code geocoding

## Source and license

- Source: [GeoNames DE.zip](https://download.geonames.org/export/zip/DE.zip), `DE.txt`.
- Attribution: GeoNames, <https://www.geonames.org/>. The postal export is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), as stated in the [source readme](https://download.geonames.org/export/zip/readme.txt). This attribution applies to the derived DEU dataset, independently of the package license.
- Retrieved: 2026-11-04. The download index lists the archive as 2026-11-04 03:53 Central European Time. This is an export timestamp; individual record observation dates are unavailable.
- Archive SHA-256: `c174ce7cb22f2a08cae2c4b076ac8d92e2a9bb4f33e310f46a67685325936e46`.
- Input: 23,296 locality rows. Output: 10,815 records and 10,815 unique five-digit postal codes. Coverage is the source's German postal-code set, not a verified complete Deutsche Post directory.

The previous file contained 16,485 rows for 8,311 unique codes. This refresh adds 2,516 codes and removes 12 codes absent from the current source: `01314`, `01462`, `01478`, `02640`, `06548`, `15751`, `15758`, `27632`, `31035`, `31087`, `64759`, `99898`. A removed code now returns `undefined`; absence is not proof that a code was never valid. In particular, the old `01462` and `01478` records had an invalid latitude of `14612`.

## Representative points and compatibility

For each postal code, remove duplicate numeric coordinate pairs, sort the pairs, and take the unweighted arithmetic mean of each coordinate. Round to six decimal places and retain strings. This avoids weighting a point by repeated source rows and removes the previous dependence on the first locality. These points are neither polygon centroids nor address-weighted centers. Six decimal places do not imply measured accuracy.

The generator validates country, five-digit codes, finite coordinates and a German bounding box. Rebuild with `unzip -p DE.zip DE.txt > /tmp/DE.txt`, then `node scripts/generate-deu-geocode.js /tmp/DE.txt`. Then run `npm run geocode:compact`. Tests cover duplicate invariance, row-order invariance, leading zeros and invalid input.

The existing lookup still returns `[longitude, latitude]` strings or `undefined`. It retains leading zeros and accepts a postal code followed by a space and locality. It does not reconstruct missing zeros or accept an internal space. No runtime, exports, types or other country data change.

## Checks and limits

Primary sources confirm these sample postal-code/locality pairs:

- Urban, leading zero: [Dresden, 01067](https://www.statistikportal.de/de/gemeindeverzeichnis/14612000); representative point 51.0547 N, 13.7269 E.
- Offshore island: [Helgoland, 27498](https://www.statistikportal.de/de/gemeindeverzeichnis/01056025); representative point 54.1814 N, 7.8863 E. [Helgoland's own guidance](https://www.helgoland.de/so-ist-helgoland/helgoland-von-a-bis-z/) also specifies 27498 for island deliveries.
- Rural Alpine municipality: [Oberstdorf, 87561](https://www.markt-oberstdorf.de/rathaus/bauverwaltung/planen-bauen/); representative point 47.4072 N, 10.2794 E.

These checks establish locality plausibility, not postal-boundary or address-level accuracy. GeoNames describes coordinates as estimated WGS84 points and can derive them from nearby postal codes. No accuracy radius is supplied here. Special recipient and PO-box codes are not independently verified. Do not use these points as scan-site coordinates or as evidence for a fraud decision. Distance estimates can be poor for large postal areas or areas with several settlements.
