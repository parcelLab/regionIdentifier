# Netherlands postal geocoding

## Source and license

- Source: [GeoNames NL.zip](https://download.geonames.org/export/zip/NL.zip).
- Retrieved: 2026-11-04. The [download index](https://download.geonames.org/export/zip/) reports 2026-11-04 as the archive modification date. This is a distribution date, not a survey date; individual observation dates are unavailable.
- Attribution: GeoNames, https://www.geonames.org/.
- License: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/), as stated in the [postal download readme](https://download.geonames.org/export/zip/readme.txt). This attribution applies to the NLD data independently of the package license.
- Source fields: country, postal prefix, locality, administrative divisions, WGS84 latitude/longitude, accuracy indicator.

## Coverage and method

The source has 4,334 rows and 4,086 distinct four-digit prefixes. The generated file has 4,086 records, one per prefix. No missing code is filled with a municipality or country center. This is source coverage, not a claim of complete current postal coverage. Caribbean Netherlands coverage is not established; leading-zero inputs remain strings and return undefined when absent.

For each prefix, collect distinct numeric (latitude, longitude) pairs. Sort them and take their unweighted arithmetic mean, rounded to six decimal places. Repeated identical rows do not change the result. At this geographic scale, the mean is a deterministic representative point. It is not a postal-area, address-weighted, or population-weighted centroid. The six decimal places are output formatting, not an accuracy claim. GeoNames describes estimated positions and gives no completeness or accuracy warranty.

Rebuild with Node.js and the extracted source file:

```sh
node scripts/generate-nld-geocode.js /path/to/NL.txt
npm run geocode:compact
```

The generator asserts country, field count, prefix format, finite coordinate ranges, and unique output prefixes. It writes only `geocode/NLD.json`.

## Lookup behavior

NLD accepts a four-digit prefix or a full code with two letters, with or without intervening whitespace. Letter case and outer whitespace are ignored. For example, `1012`, `1012AB`, and `1012 ab` resolve to the same prefix point. Malformed and unknown inputs return undefined. Coordinates retain the legacy `[longitude, latitude]` order and string values. Other countries keep their existing normalization.

Full-code lookup intentionally discards the two letters. [PostNL](https://www.postnl.nl/klantenservice/algemene-vragen/opbouw-postcode/) describes the full format as four digits and two letters. The prefix result cannot locate a building or distinguish nearby drop-off points. It is suitable only for approximate distance analysis, with no guaranteed error bound.

## Primary-source checks

On 2026-11-04, queried the [PDOK government geocoder](https://www.pdok.nl/pdok-locatieserver) (`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free`, `q=postcode:<prefix>`, `fq=type:postcode`, `rows=1`). PDOK returned these BAG postcode samples. These checks establish locality and approximate proximity, not full-prefix centroid accuracy or national completeness.

| Prefix | Area                          | GeoNames longitude, latitude | PDOK sample | PDOK longitude, latitude |
| ------ | ----------------------------- | ---------------------------- | ----------- | ------------------------ |
| 1012   | Amsterdam, urban              | 4.8951, 52.3735              | 1012XW      | 4.89249707, 52.3747535   |
| 1791   | Den Burg, Texel island        | 4.7949, 53.0565              | 1791WX      | 4.80212637, 53.06270983  |
| 9979   | Eemshaven, rural coastal port | 6.8303, 53.4445              | 9979XX      | 6.82269473, 53.45834319  |
| 6291   | Vaals, southern border        | 6.0154, 50.7720              | 6291VV      | 6.01176602, 50.76954312  |

Offline tests exercise the actual lookup for these points, supported input formats, misses, malformed codes, unique prefixes, coordinate ranges, and every generated record.

## Snapshot hashes

SHA-256 of the retrieved archive: `d8797ab17cd478f989d4da7bda213b462a1528da4eb8bcce91bc855fc18b7fe9`.
SHA-256 of the extracted `NL.txt`: `b183766c671f7fc8385fdcbd6909a183ba1bafd5fb36419dfa0a1d9b378d38b7`.
