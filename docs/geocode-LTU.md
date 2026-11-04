# Lithuania postal geocoding

## Source and license

- Source: [GeoNames LT.zip](https://download.geonames.org/export/zip/LT.zip), file `LT.txt`.
- Retrieved: 2026-11-04. Archive entries and the download index are dated 2026-11-04 03:54 (index uses Central European Time). This is an export date; the underlying observations have no published date.
- Attribution: postal data © GeoNames, distributed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/), as specified in the [postal download readme](https://download.geonames.org/export/zip/readme.txt). This derived dataset retains that attribution and license; the package's legacy license does not replace it.
- GeoNames publishes the extract but does not identify an official upstream LT source on its [sources page](https://www.geonames.org/postal-codes-sources.html). It provides no accuracy, timeliness or completeness warranty.

Archive SHA-256: `55f762b3df23e44e854f9dcc3204adcde95998abd0cfc6edba556c720b1013cf`.

`LT.txt` SHA-256: `fc6fff14c62dd334881ceb4e5e5f23e017ac5caeb74438165a02d35bff68b91d`.

## Coverage and method

The extract contains 21,870 rows and 2,023 distinct five-digit postal codes. All rows have finite WGS84 coordinates; none are discarded. The output contains 2,023 records, sorted by postcode. Codes remain strings to preserve leading zeros. Coordinates remain strings for compatibility with legacy geocode results, in `[longitude, latitude]` order.

For each postcode, remove duplicate numeric coordinate pairs. Average the latitude and longitude of the remaining distinct pairs with equal weights. Sort the points before summing and round the output to at most six decimal places. This gives a deterministic representative point without weighting repeated source rows. Of the codes, 1,998 have one distinct point and 25 have several. No region or country fallback is used.

These are **approximate representative locations, not postal-area or address centroids**. The source accuracy column contains 7,194 rows with value 1, 12,916 with value 3, and 1,760 with value 4. GeoNames describes 1 as estimated and 4 as a matched gazetteer point; it does not define 3 in its readme. Many source coordinates have only two to four decimal places. Six output decimals do not imply that accuracy. For code 86065 the source points span about 0.58 degrees of longitude: rural distance estimates can have substantial error.

Coverage is partial. The count is not a count of all current Lithuanian postal codes. Do not use this data for address validation, precise travel distances, or fraud decisions. Missing codes return `undefined`.

## Formats and source checks

The [UPU Lithuania addressing sheet](https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/ltuEn.pdf), supplied for the country's postal addressing system, defines five digits with `LT-` for international mail. The lookup accepts five digits, an optional case-insensitive `LT-` prefix, and surrounding whitespace. It rejects internal spaces, shortened codes and trailing text. Normalization is limited to LTU.

Checks against that primary postal reference:

- Urban / leading zero: `04340` is in Vilnius. GeoNames gives latitude 54.6932, longitude 25.2172, within Vilnius.
- Rural / poste restante: `33037` is associated with Alanta. GeoNames rows include Alanta and nearby villages at latitude 55.35, longitude 25.3. This is a coarse point shared by those localities.
- Missing rural and special-service examples: UPU lists `33264` (Galinių / Dubingiai), `60249` (Ariogala), and `52002` (Kaunas PO box). These codes are absent from this export and remain misses. No coordinates are inferred from the UPU locality names.

The UPU document checks code/locality associations and format, not numeric coordinate accuracy. Independent survey-level coordinate validation is not available here.

## Rebuild and checks

Unzip `LT.txt`, then run:

```sh
node scripts/generate-ltu-geocode.js /path/to/LT.txt > geocode/LTU.json
npx prettier --write geocode/LTU.json
npm test
npm run lint
npm run format:check
npm run validate:data
```

`test/geocode-ltu.test.js` executes the real lookup, tests documented formats and misses, validates every output coordinate and postcode, and tests deterministic duplicate handling and invalid-source rejection in the country-specific generator. Other country datasets, exports, types and normalization are unchanged.
