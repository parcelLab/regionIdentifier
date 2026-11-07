# Romania postal coordinates

## Source and license

- Data: [GeoNames RO.zip](https://download.geonames.org/export/zip/RO.zip), retrieved 2026-11-04.
- Publisher: [GeoNames](https://www.geonames.org/). Attribution applies to the ROU dataset.
- License: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/), as stated in the [postal export readme](https://download.geonames.org/export/zip/readme.txt).
- Export listing date: 2026-11-04. The underlying observation dates are not supplied.
- RO.txt SHA-256: `ce53f28e4fe58d113e894826b64ae57cf4f3b712cebc844afa0d344daab8160a`.

## Coverage and method

The export has 37,915 rows and 37,914 distinct full six-digit postal codes. All rows are retained through one representative point per code. National completeness has not been established. Unknown codes return `undefined`; no prefix or regional fallback is used. Leading zeros are retained. ROU accepts surrounding whitespace, but does not accept internal spaces or shortened codes. Other countries keep their existing normalization.

The generator validates country, code format, finite coordinates and coordinate ranges. It removes duplicate coordinate pairs per code, then takes the unweighted arithmetic mean of the distinct points, rounded to six decimal places. Only 510002 has multiple points: Miceşti and Alba Iulia. Its representative point is longitude 23.5695, latitude 46.08405. This is a mean of source locality points, not a postal-area centroid. Duplicate source rows cannot increase a point's weight.

Coordinates use WGS84. Lookup returns `[longitude, latitude]` as strings, consistent with legacy datasets. Six decimal places describe storage precision, not measured accuracy. Source accuracy values are 4 for 25,671 rows, 1 for 4,575, and absent for 7,669. GeoNames labels 4 as a matched gazetteer place and 1 as estimated; its readme also describes inferred points from nearby codes. Many urban codes share locality coordinates. These data support approximate locality distance only. They do not identify streets, buildings, drop-off sites or scan locations. No distance-error bound is available.

## Primary-source sample checks

On 2026-11-04, the [Poșta Română postal finder](https://www.posta-romana.ro/ccp.html) returned:

| Code   | Official result                   | Check                                                          |
| ------ | --------------------------------- | -------------------------------------------------------------- |
| 010011 | București, Strada Academiei nr. 7 | Urban code and leading zero                                    |
| 827060 | Crișan, Tulcea                    | Rural Danube Delta locality                                    |
| 510002 | Alba Iulia streets                | Repeated source code; representative point remains approximate |

To repeat these checks, use the finder's search by postal code. Its form sends POST requests to `/cnpr-app/modules/cauta-cod-postal/ajax/cautare_cod.php?q=` with `k_cod_postal` and `k_lang=ro`. These checks confirm code/locality associations, not exact coordinates. The official finder does not establish coordinate accuracy.

The [UPU Romania addressing sheet](https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/rouEn.pdf) confirms six-digit codes and gives 060274 and 061357 for Bucharest, and 200716 for Craiova. These samples also occur in the export. The UPU sheet is dated 10/2007; it is a format check, not proof that the whole export is current.

## Rebuild and verify

```sh
curl --fail --location https://download.geonames.org/export/zip/RO.zip -o /tmp/RO.zip
unzip -p /tmp/RO.zip RO.txt > /tmp/RO.txt
node scripts/generate-geocode-rou.js /tmp/RO.txt
npm run geocode:compact
npm test
npm run lint
npm run format:check
npm run validate:data
```

The generator checks the expected code count and the repeated-code mean. Review any changed source count before updating these checks. Offline tests exercise actual lookup results, coordinate order and string types, code formats, misses, unique codes and finite coordinate ranges.
