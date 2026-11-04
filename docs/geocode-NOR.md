# Norwegian postal geocoding

## Sources and license

Retrieved on 2026-11-04:

- [GeoNames NO.zip](https://download.geonames.org/export/zip/NO.zip), `NO.txt`, archive member dated 2026-11-04 03:54. Contains 5,132 rows and 5,132 unique four-digit codes. Every row has coordinates. The date is an export date, not proof that each point was surveyed recently.
- [GeoNames postal documentation](https://download.geonames.org/export/zip/readme.txt) licenses the data under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Attribution: GeoNames, https://www.geonames.org/. GeoNames can estimate coordinates from place names or neighbouring postcodes.
- [Bring official postcode register](https://www.bring.no/postnummerregister-ansi.txt), 5,112 unique codes. Used to exclude codes absent from the current official register. No dataset date is supplied in the file. [Official catalog license](https://data.norge.no/en/datasets/f7508db5-2167-3356-ab5e-aacffce2a9b6/postnummer-i-norge): Norwegian Licence for Open Government Data (NLOD) 2.0. Attribution: Posten Bring. [File format and categories](https://www.bring.no/en/services/address-verification-services/postcodes/postcode-manual).

## Coverage and method

The output has **5,092 records and 5,092 unique full four-digit postcodes**: the intersection of the two registers. Forty GeoNames codes absent from Bring are excluded; 20 Bring codes lack a GeoNames point and remain unsupported. This is partial coverage, not a complete national register. Svalbard code `9170` is unsupported. Do not infer coverage for Svalbard or Jan Mayen from Norwegian addressing conventions.

Each postcode has one source row, so no aggregation or duplicate weighting occurs. Generation rejects duplicate codes, missing coordinates, non-finite numbers, and coordinates outside WGS84 ranges. Coordinates remain strings in `[longitude, latitude]` lookup results, as in the existing datasets. Leading zeros are retained.

Lookup accepts four digits, outer whitespace, and an optional case-insensitive `NO-` prefix. It rejects internal spaces, truncated codes, and address text. Unknown codes return `undefined`. Region mappings and other countries do not change.

## Accuracy and sample checks

These are approximate **locality points**, not postcode-area centroids or scan locations. For example, Oslo `0001` and `0150` share a point despite different postal functions. Bring includes street, PO box, combined, and special-service codes; a match does not establish a physical parcel location. Do not use this dataset alone for fraud decisions or precise distance thresholds.

On 2026-11-04, the official Bring register confirmed the code/place pairs for Oslo `0150`, Bergen `5003`, rural Stryn `6783`, and border town Kirkenes `9900`. Independent sample addresses from the [Kartverket address API](https://ws.geonorge.no/adresser/v1/) gave:

| Code | GeoNames latitude, longitude | One official address latitude, longitude |
| ---- | ---------------------------- | ---------------------------------------- |
| 0150 | 59.9127, 10.7461             | 59.902974, 10.740326                     |
| 6783 | 61.9026, 6.7179              | 61.893913, 6.571082                      |
| 9900 | 69.7197, 30.1604             | 69.724697, 30.033276                     |

Queries: `https://ws.geonorge.no/adresser/v1/sok?postnummer=CODE&treffPerSide=1`, replacing CODE with each code above. The API reports EPSG:4258 (ETRS89), adequate for this coarse comparison. The rural Stryn sample differs by about 8 km; the Kirkenes sample by about 5 km. These are checks of plausibility, not measured error bounds. No national maximum error is established. Full four-digit lookup granularity does not imply address-level spatial precision.

## Reproduce

Download and extract the source files, then run:

```sh
node scripts/generate-geocode-nor.js /path/to/NO.txt /path/to/postnummerregister-ansi.txt
npx prettier --write geocode/NOR.json
npm test
npm run lint
npm run format:check
npm run validate:data
```

The generator asserts the observed source and output counts. Review source changes before updating those assertions. It adds no dependency and does not change other datasets.
