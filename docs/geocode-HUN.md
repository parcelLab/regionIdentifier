# Hungary postal geocoding

## Source and license

- Source: [GeoNames HU.zip](https://download.geonames.org/export/zip/HU.zip), Hungary postal-code export.
- Attribution: postal data from [GeoNames](https://www.geonames.org/), used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). This derived file groups and averages distinct source coordinate pairs. The data license is separate from the package license.
- [Source format and license statement](https://download.geonames.org/export/zip/readme.txt).
- Retrieved: 2026-11-04. The download index lists 2026-11-04 03:53 CET as the archive modification time. This is an export date, not a survey date; individual record dates are unavailable.
- Archive SHA-256: `4ae38e08b0aac2b839d892abcdaf4549c197dfa9a03d8d4ec66ed02d90e51d6a`.
- Extracted `HU.txt` SHA-256: `6bb363bb2b903fa4aece8068e61b45c700657d1e180acbda05ae5fc0ffaa461f`.

## Coverage and precision

The export contains 3,571 locality rows and 3,046 distinct four-digit postal codes. All source rows are included. Coverage is limited to this export; complete national coverage, special-use codes, and current postal validity are not established.

For each code, remove repeated coordinate pairs, sort the pairs, and calculate the unweighted arithmetic mean of latitude and longitude. Round to four decimal places and store strings to match existing lookup values. This gives a deterministic locality representative, not a postal-area centroid. Duplicate source rows do not increase a point's weight. This method is suitable only for approximate distance estimates within Hungary.

The source accuracy field contains 3,542 rows marked 4 (geonameid), seven marked 3, and 22 marked 1 (estimated). GeoNames can estimate points from place names or nearby postal codes. Four decimal places describe storage precision, not measurement accuracy. Budapest codes can share a city point: `1014` returns the source's Budapest point, not a district or street centroid. Shared rural codes can cover multiple settlements. No address-level accuracy or error bound is provided.

## Format and checks

Magyar Posta describes domestic postcodes as four numeric digits in its [Sender documentation](https://www.posta.hu/sender). HUN lookup accepts the full code with optional surrounding whitespace. It does not accept internal spaces, country prefixes, city suffixes, or truncated codes. Other countries retain their normalization behavior. Unknown codes return `undefined`; output order remains `[longitude, latitude]`.

Primary-source postal checks:

- Urban: Magyar Posta lists Budapest 1 posta at `1014`, Dísz tér 15 in its [post office list](https://www.posta.hu/static/internet/download/Elsonapi_postak_cimmel.pdf).
- Rural western border: the [Kercaszomor municipal office](https://kercaszomor.hu/kozos-onkormanyzati-hivatal/) uses `9945`.
- Northern border: the [Hollóháza municipal site](https://hollohaza.hu/altalanos-informaciok/) uses `3999`.

These sources verify postal/locality associations. The coordinates are GeoNames estimates, not independently surveyed points. For example, GeoNames publishes Kercaszomor near 46.789/16.353 in its [Vas postal table](https://www.geonames.org/postal-codes/HU/VA/vas.html). Offline tests lock the source coordinates for the three examples, check a shared code, validate all coordinate ranges and unique codes, and check malformed and unknown inputs.

## Regeneration

Download and extract `HU.txt` from the source archive, then run:

```sh
python3 scripts/generate-hun.py /path/to/HU.txt geocode/HUN.json
npx prettier --write geocode/HUN.json
```

The generator uses only the Python standard library. Its assertions check duplicate-insensitive averaging, source schema, country, code format, and finite coordinates within a Hungary bounding box. Run without Python's `-O` option so assertions remain active.
