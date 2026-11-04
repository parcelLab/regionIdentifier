# Serbia postal geocoding

Source: [GeoNames RS postal archive](https://download.geonames.org/export/zip/RS.zip).
Retrieved 2026-11-04; archive members dated 2026-11-04. This is an export date,
not a survey date. Attribution: GeoNames, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
See the [source readme](https://download.geonames.org/export/zip/readme.txt).

Each five-digit postal code maps to the arithmetic mean of its distinct longitude,
latitude pairs. Duplicate rows do not add weight. Values are rounded to six decimal
places and stored as strings for compatibility. These are representative locality
points, not postal-area centroids. The source can infer coordinates from nearby
postal codes. Decimal precision does not establish spatial accuracy.

Coverage is limited to codes in this export. National completeness is not established.
Unknown codes return undefined. Existing space-delimited suffix handling is retained.
No PAK (six-digit street segment) lookup is provided.

The Post of Serbia distinguishes PAK locations from postal offices in its
[GIS service description](https://www.posta.rs/eng/privreda/usluga.aspx?usluga=e-services/geographic-information-system-of-the-post-of-serbia-gis/services-of-geographic-information-system-gis-of-the-post-of-serbia).
Use these approximate points for coarse distance analysis only.

The export has 1,155 source rows and 1,149 unique postal codes.
The [official post-office list](https://www.posta.rs/DocumentViewer.aspx?IdDokument=1000970)
confirms 11000 as Beograd. Independent coordinate validation for rural and edge
codes is still open; this dataset does not claim post-office or delivery precision.
