# South Korea postal coordinates

## Source and license

- Publisher: [GeoNames](https://www.geonames.org/).
- Download: <https://download.geonames.org/export/zip/KR.zip>.
- Format and license: <https://download.geonames.org/export/zip/readme.txt>.
- License: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). This attribution applies to `geocode/KOR.json`, derived from GeoNames, with the changes below.
- Retrieved: 2026-11-04. Archive member timestamp: 2026-11-04 03:54:02 (timezone unspecified). This is a file timestamp, not a survey date.
- Archive SHA-256: `74d3a1219c908f8309f8a3e54e176e7dda58c97c3298250cb13e68888286cfc6`.

## Coverage and method

The source has 35,583 rows and 34,249 distinct five-digit postal codes. The output has 34,249 rows, one per full postal code. Leading zeros are retained. Coverage includes Seoul, rural Jeju, Chuja islands and Dokdo. National completeness has not been established. The GeoNames source table does not identify an official upstream KR publisher; this is a GeoNames dataset, not a Korea Post extract.

For each code, remove duplicate numeric latitude/longitude pairs, sort the distinct pairs, and take their unweighted arithmetic mean. Round to six decimal places. This prevents repeated source rows from adding weight. There are 1,182 codes with multiple distinct points. The result is a representative point, not a measured postal-area or address centroid. No missing coordinates are filled and no region centers are added.

Source accuracy flags are 6 for 35,490 rows, 4 for 48 rows, and 2 for 45 rows. GeoNames defines these as centroid, geoname match, and estimated respectively. These flags do not establish an error bound. GeoNames also documents inferred locations and neighboring-code averages in its general method. Six decimal output precision does not imply that level of accuracy.

## Checks against primary sources

- Urban and leading zero: [Seoul Metropolitan Government](https://www.seoul.go.kr/policy/contact-us.do) lists `04524` for City Hall, 110 Sejong-daero, Jung-gu. The source point is 126.9777 E, 37.5662 N, consistent with central Seoul.
- Rural: the [Jeju village survey held by the National Assembly Library](https://clik.nanet.go.kr/clikr-collection/policyinfo/74/644/2015/CLIKC2001987455406408_attach_3.pdf) lists `63002` in Hangyeong-myeon. The source labels this code Hangyeong-myeon and gives 126.1878 E, 33.3453 N in western Jeju.
- Island edge: [Korea Institute of Ocean Science and Technology](https://moeri.kiost.ac.kr/cop/bbs/BBSMSTR_000000000075/selectBoardArticle.do?nttId=25804) identifies `40240` as the Dokdo postal code. The source point is 131.8678 E, 37.24 N, consistent with Dokdo, despite the broad source locality label Ulleung-eup.

These checks confirm postal/locality associations and broad location plausibility. They do not validate numerical postal-area centroids or all codes.

## Runtime and reproduction

`lib/geocode.js` accepts KOR through the existing country resolution and returns `[longitude, latitude]` as strings. Five-digit compact codes work. Existing space suffix handling is retained (`04524 Seoul` resolves as `04524`). Internal spaces and obsolete six-digit/hyphenated codes are not converted. Unknown codes return `undefined`. Other countries and public exports are unchanged.

Run `node scripts/generate-kor-geocode.js /path/to/KR.zip`, then `npm run geocode:compact`. The generator uses the `unzip` command to read `KR.txt` from the archive. It validates country, code format and finite coordinate ranges before writing. Tests verify that duplicates and input order do not change the average.

Run `npm test`, `npm run lint`, `npm run format:check`, and `npm run validate:data`. Offline KOR tests check real lookups, representative urban/rural/island cases, leading zeros, misses, uniqueness and coordinate ranges.

Use these points for approximate distance analysis only. No fraud decision, distance product, or accuracy guarantee is included.
