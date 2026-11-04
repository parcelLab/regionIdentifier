# Austria postal-code coordinates

## Source and license

- Source: [GeoNames Austria postal export](https://download.geonames.org/export/zip/AT.zip).
- Attribution: GeoNames, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), as stated in the [postal export readme](https://download.geonames.org/export/zip/readme.txt). No Austria-specific restriction is stated there. This derived file retains that attribution and license.
- Retrieved: 2026-11-04. HTTP Last-Modified: 2026-11-04 02:53:20 GMT. This is the export date, not a survey date.
- Archive SHA-256: `baff07a5779fec9e0b0355aa3dc39ed51dd5540da0acb626c78854a8db370f4c`.
- Source: 19,225 locality rows, 2,501 distinct four-digit postal codes. Output: 2,501 records. Previous file: 19,055 rows, 2,215 distinct codes.

## Method and compatibility

Run `python3 scripts/generate-aut-geocode.py AT.txt geocode/AUT.json` after extracting the archive. The script validates each row, postal-code format, finite coordinates and coordinate ranges. Its self-check verifies duplicate removal and preservation of a synthetic leading zero.

For each postal code, remove duplicate latitude/longitude pairs, then calculate the arithmetic mean of each coordinate. Each distinct point has equal weight. Sort codes and round to four decimal places. This deterministic representative point is not a postal-area centroid, a population-weighted center or a delivery address. Duplicate source rows do not add weight. A mean can fall between settlements.

The lookup retains string coordinates in `[longitude, latitude]` order. It accepts four-digit codes and the existing `1010 Wien` format. It does not add padding, country-prefix support or new normalization. Unknown codes return `undefined`. No runtime, exports, types or other country data change.

## Coverage and checks

The [GeoNames country page](https://www.geonames.org/countries/AT/austria.html) identifies the four-digit format. The export covers all nine states, but national completeness and current delivery status are not established. The [Austrian Post directory](https://www.post.at/g/c/postlexikon) includes current and historical codes; a source code does not establish an active delivery area.

Primary-source postal/locality checks:

- Urban: [City of Vienna](https://www.wien.gv.at/inhalt/impressum), 1010 Wien. Source point: 48.2085, 16.3721, in central Vienna.
- Rural: [Land Tirol](https://www.tirol.gv.at/gemeinden/gemeinde/70721), 9942 Obertilliach. Four source locality points give 46.7135, 12.6058, near Obertilliach.
- Border: [Statistics Austria street directory](https://www.statistik.at/verzeichnis/strassenliste/gemplzstr_8.pdf), 6991 Riezlern in Mittelberg. Source point: 47.3578, 10.1876, in Kleinwalsertal.

These checks confirm postal/locality associations and geographic plausibility, not measured positional error. Offline tests execute all 2,501 lookups, check unique codes and coordinate ranges, and pin these three examples.

## Limits

GeoNames states that coordinates can come from place-name matching or averages of neighboring postal codes. Its accuracy fields are heterogeneous; decimal precision is not positional accuracy. For example, 1300 is associated with Mannswörth in the export; do not interpret its point as the Vienna airport terminal. No special-code audit or comparison against a complete current Austrian Post list was done. Use these points only for approximate postal-level distance analysis. They cannot establish the distance of an individual parcel journey or support a fraud decision alone.
