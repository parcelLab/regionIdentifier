# Belgium postal-code points

## Source and license

- Data: [GeoNames BE.zip](https://download.geonames.org/export/zip/BE.zip), file `BE.txt`.
- Attribution: © GeoNames, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The [source readme](https://download.geonames.org/export/zip/readme.txt) permits redistribution with attribution. This file records the transformation; the source license continues to apply to the derived BEL data.
- Retrieved: 2026-11-04. The download index lists archive modification time as 2026-11-04 03:53 CET. This is an export date, not proof that every underlying observation is current. No per-record observation date is supplied.
- SHA-256 of extracted `BE.txt`: `b194ccb19c8358f859243596fa3e473919af9263ecbd0ff7830fc06278e25155`.

## Coverage and method

The source has 2,781 locality rows and 1,146 distinct four-digit postal codes. The output has 1,146 rows, one per postal code. It covers source-listed Belgian localities, not a verified complete national postal register. Leading zeros are retained as strings; the source has no leading-zero codes. Special code `0612` is not covered and returns `undefined`.

For each postal code, remove duplicate latitude/longitude pairs, then take the unweighted arithmetic mean of the distinct pairs. Sort pairs before summing for deterministic output. Round to six decimal places and store strings to preserve the existing return type. 516 codes have more than one distinct source point. This is a representative locality point, not a postal-area or population centroid. Duplicate source rows cannot add weight. No coordinates are invented for missing codes.

Rebuild with Python 3 (standard library only):

```sh
curl -fsS https://download.geonames.org/export/zip/BE.zip -o /tmp/BE.zip
unzip -o /tmp/BE.zip -d /tmp/BE
python3 scripts/generate-BEL.py /tmp/BE/BE.txt
npx prettier --write geocode/BEL.json
```

The generator checks the country, four-digit code format, finite coordinate ranges, and duplicate/order invariance with assertions. Run without Python's `-O` option.

## Behavior and accuracy

`coordinates` still returns `[longitude, latitude]` as strings. Four-digit codes and code-plus-town input work through the existing space split. Country aliases and country-code case behavior are unchanged. Internal spaces, country prefixes, and truncated postal codes are not added as supported formats. Runtime code, exports, types, and other countries are unchanged.

The previous file had 3,386 rows and 1,175 unique codes; lookup selected the first locality. Updating to the current source removes these 29 codes, which now return `undefined`:

`1005`, `1006`, `1007`, `1008`, `1009`, `1010`, `1011`, `1012`, `1031`, `1041`, `1043`, `1044`, `1045`, `1047`, `1048`, `1049`, `1100`, `1105`, `1110`, `1201`, `1212`, `1414`, `1804`, `1818`, `1931`, `1934`, `4090`, `4151`, `7010`.

Their omission does not establish that they are invalid postal codes. The old file has no verified source provenance for retaining their coordinates. Do not substitute Brussels or another center for a missing code.

GeoNames describes its coordinates as estimates: some are matched to locality names and some can be inferred from neighboring postal codes. Six decimal places describe storage precision, not measured accuracy. The mean can lie between villages and has no validated error bound. Use only for approximate distance analysis, not a specific delivery point or a fraud decision.

## Primary-source checks

The [UPU Belgium addressing sheet](https://www.upu.int/UPU/media/upu/PostalEntitiesFiles/addressingUnit/belEn.pdf), supplied with bpost contact details, specifies four digits with no country prefix and gives `1000 Bruxelles` and `9990 Maldegem` as examples. [bpost's Burg-Reuland service-point page](https://www.bpost.be/en/points-of-sale/Lige/BURG-REULAND-4790/BURGREULAND) confirms rural border-area code `4790`. These locality/code checks agree with the source; they do not independently certify the coordinates. Offline tests pin the urban point, the two-point rural mean, and the high-end postal code, and execute lookup for every output row.
