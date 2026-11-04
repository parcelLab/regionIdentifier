# CAN postal-code geocoding

## Source and license

The dataset is derived from [GeoNames CA.zip](https://download.geonames.org/export/zip/CA.zip), retrieved on 2026-11-04. The download index reports 2026-11-04 03:53 CET. This is an export timestamp; the dates of the underlying observations are unknown.

GeoNames licenses its postal files under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), as stated in its [postal-data readme](https://download.geonames.org/export/zip/readme.txt). Credit: [GeoNames](https://www.geonames.org/). This derived file filters records and combines repeated codes. Archive SHA-256: `c7e68ee67dec276ff04c825947100fcd485dffc98f46a544382d2c37a4c016b2`.

## Coverage and method

The source has 1,657 rows and 1,653 distinct postal strings. The output has **1,650 rows and 1,650 unique three-character forward sortation areas (FSAs)**, with records in all 13 provinces and territories. Coverage is limited to the source; this is not a complete or current Canada Post postal-code register.

- Exclude `H0H`: its source point is latitude 90, longitude 0. Canada Post uses [H0H 0H0 for its Santa program](https://www.canadapost-postescanada.ca/cpc/en/our-company/write-letter-to-santa.page). It is unsuitable for physical-distance estimates.
- Exclude full-code anomalies `T3T 0E5` and `V3Y 0H2`. Do not turn an isolated full-code point into an FSA point. `V3Y` has a separate FSA record; `T3T` remains unsupported.
- For each FSA, deduplicate latitude/longitude pairs. Take the arithmetic mean of the distinct pairs, in sorted order, rounded to six decimal places. This is a representative mean of source points, **not a postal-area, address-weighted, or population-weighted centroid**. Repeated rows do not increase a point's weight.
- `L9X` has four distinct points; its result is latitude 44.443175, longitude -79.77035. `C0A` has two rows with the same point, so its coordinates stay unchanged.
- Preserve `[longitude, latitude]` string results. Coordinates use WGS84. Decimal places do not establish positional accuracy. Validate finite values, geographic ranges, code syntax and output uniqueness during generation and offline lookup tests.

To regenerate, extract the pinned archive, run `python3 scripts/generate-can.py /path/to/CA.txt`, then run `npx prettier --write geocode/CAN.json`. The script checks source counts and exclusions and has an assert-based duplicate-weighting self-check. Review a later source release before changing its assertions.

Compared with the legacy file, this refresh removes unsupported `L0V`, removes the H0H point, adds source FSAs, updates changed source coordinates, and replaces duplicate rows with one representative point. It does not change region identification.

## Lookup behavior and checks

CAN accepts an FSA or a syntactically valid full postal code, in spaced or compact form, with either case and optional surrounding whitespace. Full codes resolve to their FSA point. The suffix is checked for syntax, not existence. Unknown FSAs and invalid input return `undefined`; there is no country-center fallback. Other countries keep their existing normalization.

Primary-source checks on 2026-11-04:

| Case          | Evidence and interpretation                                                                                                                                                                                                                        |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Urban         | The [House of Commons](https://www.ourcommons.ca/en/contact-us) gives Ottawa K1A 0A6. K1A resolves to 45.4207, -75.7023, in Ottawa. This verifies regional plausibility, not building accuracy.                                                    |
| Rural FSA     | [St. Paul](https://www.stpaul.ca/residents) gives T0A 3A0. T0A resolves to the source's Eastern Alberta point, 54.766, -111.7174. This is a broad-area estimate, not the town office location.                                                     |
| Northern edge | [Whitehorse](https://www.whitehorse.ca/contact-us/) gives Y1A 1C2. Y1A resolves to 60.7161, -135.0537, near the [official Whitehorse place-name point](https://geonames.nrcan.gc.ca/search-place-names/unique?id=KAHFT), 60°43′27″ N, 135°3′22″ W. |
| Special code  | Canada Post's Santa code above has no usable physical-distance point and returns `undefined`.                                                                                                                                                      |

## Accuracy limits

[Statistics Canada](https://www150.statcan.gc.ca/n1/pub/92-179-g/92-179-g2021001-eng.htm) defines FSAs as the first three postal characters and distinguishes census FSAs from Canada Post delivery areas. Its census boundary product is not the source of these coordinates.

GeoNames uses estimated and locality-derived points as well as some centroid records. No national error bound is supplied. Rural and northern FSAs can span very large areas: X0A's source point is 79.6218, -76.7765 and must not be interpreted as Iqaluit's position. Two distant full codes in the same FSA return the same point and therefore produce zero distance. Distances between these representative points cannot establish travel distance, drop-off location, or fraud. No full-code accuracy or national completeness is claimed.
