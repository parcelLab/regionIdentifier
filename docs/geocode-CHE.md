# Switzerland (CHE) postal geocodes

Source attribution: **Federal Office of Topography swisstopo**.

- [Official directory of towns and cities](https://www.swisstopo.admin.ch/en/official-directory-of-towns-and-cities).
- [WGS84 CSV archive](https://data.geo.admin.ch/ch.swisstopo-vd.ortschaftenverzeichnis_plz/ortschaftenverzeichnis_plz/ortschaftenverzeichnis_plz_4326.csv.zip).
- [STAC metadata](https://data.geo.admin.ch/api/stac/v0.9/collections/ch.swisstopo-vd.ortschaftenverzeichnis_plz/items/ortschaftenverzeichnis_plz).
- Retrieved 2026-11-04. Monthly release: 2026-11-01; STAC asset updated 2026-11-01T09:44:22.264475Z. Archive member timestamp: 2026-10-29.
- Archive SHA-256: `5c744e0f0d6be63cef7b367fa0e9a6007f3b51d6db6460875dc4326b74fba0ee`.
- License: [swisstopo terms for free geodata and geoservices](https://www.swisstopo.admin.ch/en/terms-of-use-free-geodata-and-geoservices), version 2021-03-01. These terms permit processing, commercial use and redistribution with attribution. This data retains these terms; the package license does not replace them.

## Coverage and precision

The archive has 5,717 locality/municipality rows. Excluding the 20 rows without a Swiss canton (Liechtenstein) leaves 5,697 Swiss rows and 3,177 unique four-digit postcodes. Building-address postcodes are covered; PO box, company and administrative postcodes are excluded by the source. For example, 3001 is absent. Liechtenstein is not included under CHE. Do not claim coverage of every Swiss postal-service code.

[The January 2026 source change](https://www.swisstopo.admin.ch/en/official-directory-of-towns-and-cities-update-20260101) places each source point at the highest address density in its locality perimeter. The source can have several points per four-digit code and municipality splits. The generator first removes identical coordinate pairs per code. It then selects the source point with the smallest sum of great-circle angular distances to the other distinct points (an unweighted medoid). Sorted longitude/latitude order breaks ties. Duplicate rows do not add weight. No address-count weights are inferred from municipality address percentages.

This is a representative locality point, not a postal-area centroid, building coordinate or measured drop-off position. Large rural and Alpine postcodes can have substantial location error. Decimal digits preserve the source value; they do not establish metre-level accuracy.

## Reproduction and checks

Extract `AMTOVZ_CSV_WGS84/AMTOVZ_CSV_WGS84.csv` from the archive, then run:

```sh
node scripts/generate-che.js /path/to/AMTOVZ_CSV_WGS84.csv
npm run geocode:compact
```

The generator validates codes and coordinate ranges. Tests verify medoid selection and tie-breaking. Country tests execute actual lookups for all output codes and verify unique codes, coordinate ranges and misses. Primary-source CSV rows verify Zürich 8001 (urban), Wengen/Kleine Scheidegg/Eigergletscher 3823 (rural Alpine), Samnaun Dorf 7563 (border), and La Chaux-de-Fonds/La Cibourg 2300 (shared code). For 3823, the selected source point is Kleine Scheidegg; it must not be described as Wengen's position.

Runtime adds CHE to the existing geocode allowlist. Results retain `[longitude, latitude]` strings. Existing space-suffix handling is unchanged (`8001 Zürich` resolves); no country-prefix or leading-zero padding is added. Swiss codes have four digits. Unknown and out-of-scope codes return `undefined`. No public exports or types change.
