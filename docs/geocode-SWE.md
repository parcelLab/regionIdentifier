# Sweden postal code coordinates

Source: [GeoNames Sweden postal export](https://download.geonames.org/export/zip/SE.zip).
Retrieved 2026-11-04; HTTP Last-Modified: 2026-11-04 02:54:18 GMT.
Source archive SHA-256: `e4c10d6063739e62556bfd7403c85738b0984930034beb4d00d136b3ae7616c7`.

Attribution: GeoNames, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
See the [publisher's format and license notes](https://download.geonames.org/export/zip/readme.txt).
The repository's package license does not replace this data license.

## Coverage and transformation

18,887 source rows become 18,887 unique five-digit postal codes. Coverage is
limited to this export; national completeness and currency are not established.
Remove the postal code's internal space, sort by code, and retain source
latitude and longitude strings. No aggregation, interpolation, or duplicate
weighting is applied. The import checked that all codes were unique five-digit
strings and all coordinates were finite and within WGS84 coordinate ranges.

The lookup accepts `11120` and `111 20`. It returns longitude followed by
latitude as strings, consistent with existing data. Unknown or malformed codes
return undefined. Other countries keep their existing normalization.

## Accuracy limits and checks

These are estimated representative points, not verified postal centroids or
street addresses. GeoNames describes place-name matching and estimates from
nearby postal codes. Source accuracy varies. For example, `98107` is labelled
Abisko but has a low-rated point near Kiruna; it must not be used for precise
distance decisions. No source points were replaced with invented coordinates.
Postal code distance is approximate and can have large errors in rural areas.

Offline tests pin Stockholm `11120` and island locality Fårö `62466` to source
values and validate every coordinate and code. The
[Gotland municipality register](https://alkt.gotland.se/ol2webbforms/Shops)
confirms `624 66` for Fårö. The
[Kiruna municipality notice](https://kiruna.se/arkiv/nyhetsarkiv/nyheter/2024-06-25-nya-lokaler-for-socialtjansten-ifo-myndighet-och-administration.html)
confirms `981 31` for Kiruna. These checks confirm postal locality associations,
not point accuracy. No independent authoritative coordinate validation was
available. Do not treat the source's decimal places as measured accuracy.

To reproduce, unzip `SE.txt`, parse its tab-separated columns, remove the space
from column 2, and map columns 10 and 11 to latitude and longitude. Reject
repeated codes, malformed codes, and invalid coordinates before writing JSON.
The archive contains no repeated codes, so no representative-point selection
rule is needed.
