# Portugal postal coordinates

## Source and license

- Source: [GeoNames PT.zip](https://download.geonames.org/export/zip/PT.zip), member `PT.txt`.
- Retrieved: 2026-11-04. The [download index](https://download.geonames.org/export/zip/) lists the archive as modified 2026-11-04 03:54 CET. This is an export date, not a date of postal verification.
- License: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). Attribution: GeoNames, https://www.geonames.org/.
- The [source documentation](https://download.geonames.org/export/zip/readme.txt) defines WGS84 estimated coordinates and warns that accuracy, currency, and completeness are not guaranteed. GeoNames can infer points from place names or nearby codes. No CTT data is copied into this dataset.

## Coverage and point method

The input has 206,942 rows and 197,772 distinct full postal codes. The output has 197,772 records, one per code. It includes mainland Portugal, Madeira, and the Azores. This does not establish complete national coverage.

Each key retains all seven digits in `NNNN-NNN` form. For each code, remove duplicate coordinate pairs, then calculate the unweighted arithmetic mean of the distinct pairs. There are 1,307 codes with more than one distinct pair. Round to six decimal places and store strings to match legacy lookup output. Repeated source rows do not add weight. This is a representative estimated point, not an address or postal-area centroid. Decimal precision is not positional accuracy.

Regenerate from the extracted source with:

```sh
node scripts/generate-prt-geocode.js /path/to/PT.txt
npm run geocode:compact
```

The converter checks country, postal format, finite coordinates, and global ranges. Tests cover duplicate removal and averaging. Offline tests check all output points against broad Portugal bounds, unique keys, count, and actual lookup results.

## Lookup behavior and spot checks

PRT accepts full hyphenated, compact, or single-space-separated codes, with outer whitespace removed. Four-digit prefixes and unknown full codes return `undefined`. Other countries retain their current normalization. Output remains `[longitude, latitude]` with string values.

Primary-source checks on 2026-11-04 confirm postal locality associations:

- Urban: [CTT accepting shops](https://www.ctt.pt/application/themes/pdfs/lojas_aceitantes_expresso_para_hoje_1h_2h_mesmacidade.pdf) lists `1000-996` in Lisboa. Source point: 38.7167, -9.1333.
- Rural municipality: [Mértola municipal contacts](https://www.cm-mertola.pt/contactos) lists `7750-329` in Mértola. Source point: 37.643, -7.6611.
- Island edges: [CTT shop cutoffs](https://www.ctt.pt/application/themes/pdfs/horas%20de%20corte%20recolhas%20nas%20lojas%20ctt%2011set.pdf) lists `9000-994` in Funchal and `9500-112` in Ponta Delgada. Source points: 32.6333, -16.9 and 37.7462, -25.6669.

These checks confirm locality associations and broad geographic plausibility. They do not validate exact point accuracy. Many full codes share locality coordinates. Use these points for approximate distance only; short distances can be dominated by source error. No national completeness audit or address-level calibration was done.
