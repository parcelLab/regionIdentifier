# USA geocoding

## Source and license

- Data: [GeoNames US postal codes](https://download.geonames.org/export/zip/US.zip).
- Publisher: [GeoNames](https://www.geonames.org/).
- Retrieved: 2026-11-04. The download index and ZIP member date are 2026-11-04. This is an export date, not proof that each ZIP code was checked on that date.
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), as stated in the [postal data readme](https://download.geonames.org/export/zip/readme.txt). Attribute GeoNames when you redistribute this data. This USA refresh uses CC BY 4.0; the repository's historical CC BY 3.0 statement does not replace these source terms.
- Archive SHA-256: `9a9dfa873df4c1b8ea253239a64e5d1c663ca876e2aa6784db97b4707393c595`.
- Extracted US.txt SHA-256: `88495471922bbafb1e982c01aafd1e38038d08dde578be2ec5bbc0f16bf9dc9e`.

## Coverage and precision

The input has 41,490 rows and 41,488 unique five-digit ZIP codes. The output has 41,488 records, one per code. The previous file had 40,934 records. Leading zeros and coordinate strings are preserved. The lookup returns `[longitude, latitude]`.

These are estimated WGS84 locality points, not verified postal centroids or building locations. GeoNames can infer coordinates from place names or nearby codes. Its accuracy field does not give a distance error bound. Do not use the decimal count as an accuracy claim. Coverage is partial: the US file excludes separate GeoNames territory files such as Puerto Rico (`00901` is absent). There is no claim of complete or current USPS coverage. Compared with the previous snapshot, 563 codes are added, 477 retained points change, and nine codes absent from the current US source are removed: `96912`, `96940`, `96941`, `96942`, `96943`, `96944`, `96950`, `96951`, `96952`. These include Guam, Northern Mariana Islands, Palau and Micronesia postal codes. They now return `undefined`; separate territory/country source files are not imported by this USA refresh.

Military postal codes can have foreign destination points. For example, `34034` now uses the source's Buenos Aires point rather than the previous Georgia point. Such codes are not reliable evidence of a physical parcel location. The data has no address or ZIP+4 precision and cannot determine fraud or a parcel's actual route.

## Transformation

Run from the repository root:

```sh
curl --fail --show-error --location https://download.geonames.org/export/zip/US.zip -o /tmp/US.zip
unzip -p /tmp/US.zip US.txt > /tmp/US.txt
node scripts/generate-geocode-usa.js /tmp/US.txt
npx prettier --write geocode/USA.json
```

The script validates country, five-digit format, nonempty finite coordinates and global coordinate ranges. It sorts codes and computes an unweighted arithmetic mean of distinct coordinate pairs per code, rounded to at most six decimals. Duplicate source rows cannot add weight. Only `96860` and `96863` have multiple points in this snapshot. This produces a deterministic representative point, not a geographic or population centroid. The short, local Hawaii point pairs do not cross the antimeridian. The generator asserts the record count and the `96860` mean; review these checks if the source changes.

USA lookup accepts trimmed five-digit codes, compact nine-digit ZIP+4, hyphenated ZIP+4, and a single space before four extension digits. Each uses the five-digit point. Malformed and unknown codes return `undefined`. Country aliases use the existing resolver. Other countries retain their normalization behavior.

## Primary-source checks

Checked on 2026-11-04 against the [2026 Census Gazetteer ZCTA file](https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2026_Gazetteer/2026_Gaz_zcta_national.zip). These checks confirm approximate geographic agreement, not postal delivery validity. [Census explains](https://www.census.gov/programs-surveys/geography/guidance/geo-areas/zctas.html) that ZCTAs approximate ZIP delivery areas; not all ZIP codes have ZCTAs.

| ZIP   | Example              | GeoNames latitude, longitude | Census internal latitude, longitude |
| ----- | -------------------- | ---------------------------- | ----------------------------------- |
| 01001 | Agawam, leading zero | 42.0702, -72.6227            | 42.060536, -72.623604               |
| 10001 | New York, urban      | 40.7484, -73.9967            | 40.750649, -73.997298               |
| 59001 | Absarokee, rural     | 45.5154, -109.4692           | 45.530159, -109.539994              |
| 99553 | Akutan, Alaska edge  | 54.143, -165.7854            | 54.150375, -165.849166              |
| 90210 | Beverly Hills        | 34.0901, -118.4065           | 34.100527, -118.414631              |

The rural and Alaska examples differ by several kilometres. Postal-area size and point uncertainty can materially affect short-distance comparisons. Census coordinates are comparison evidence only; they are not mixed into the dataset.

Offline tests execute the actual lookup for input forms, leading zeros, urban/rural/Alaska examples, duplicate aggregation, unknown codes and territory gaps. They also validate every output record for format, uniqueness, type and coordinate range.
