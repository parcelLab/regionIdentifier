# Czechia postal geocoding (CZE)

## Source and license

Data: [GeoNames CZ postal export](https://download.geonames.org/export/zip/CZ.zip),
retrieved 2026-11-04. The [export directory](https://download.geonames.org/export/zip/)
listed the archive as 2026-11-04 03:53 CET. This is the export date, not a verified
survey date. Source text SHA-256:
`0534ebad1470188b4323a5ece68786e261cab07027082672fa782ab74c7553d3`.

Credit: [GeoNames](https://www.geonames.org/), licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
The [source readme](https://download.geonames.org/export/zip/readme.txt) permits
redistribution with attribution and provides the data without a completeness or
accuracy warranty. This file documents our normalization and aggregation changes.

## Coverage and lookup

The export contains 15,507 locality rows and 2,694 unique full five-digit Czech
postcodes. The output contains 2,694 records. Coverage is source-limited; no complete
national coverage claim is made. No missing code gets a fallback point.

CZE accepts `11000` and `110 00`, with surrounding whitespace. It rejects prefixes,
extra text, country prefixes, and malformed codes. Keys remain strings. No leading
zero is removed or added; the export has no leading-zero postcodes. Unknown codes
return `undefined`. Coordinates retain the existing `[longitude, latitude]` string
return format. Other countries keep their current normalization.

For each postcode, the generator removes duplicate numeric coordinate pairs,
sorts them, and takes their unweighted arithmetic mean. It rounds to six decimal
places. These are representative locality points, not postal-area centroids,
address coordinates, post-office coordinates, or measured parcel locations.
Decimal precision does not establish spatial accuracy.

## Checks and accuracy limits

Czech Post identifies [Praha 1 (11000)](https://www.postaonline.cz/detail-pobocky/-/pobocky/detail/11000),
[Mariánské Lázně 1 (35301)](https://www.postaonline.cz/detail-pobocky/-/pobocky/detail/35301),
and the eastern rural/border location [Mosty u Jablunkova (73998)](https://www.postaonline.cz/detail-pobocky/-/pobocky/detail/73998).
These primary-source checks confirm postcode/locality associations. They do not
independently validate a postcode-wide mean coordinate.

The corresponding output points are respectively `[14.425633, 50.084633]`,
`[12.710055, 49.976003]`, and `[18.793250, 49.523850]`. Mariánské Lázně includes
29 distinct points; Mosty includes two. A rural shared postcode can cover several
settlements, so an average can be kilometres from an actual address. GeoNames can
estimate coordinates from nearby postcodes when a place cannot be matched. There
is no measured national error bound. Use only for approximate distance analysis;
these data do not establish which physical scan site or address a parcel used.

## Reproduction and offline tests

Extract `CZ.txt` from the linked archive, then run:

```sh
node scripts/generate-geocode-cze.js /path/to/CZ.txt > geocode/CZE.json
npx prettier --write geocode/CZE.json
```

The generator validates source country, format, and finite coordinates within a
Czechia bounding box. Offline tests cover every output lookup, unique keys,
coordinate ranges, supported inputs, unknown/malformed codes, legacy DEU behavior,
and duplicate-independent generation. No region mappings are added.
