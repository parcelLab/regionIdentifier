# Denmark postal geocoding

DNK geocoding uses full four-digit postal codes. It is independent of static
region lookup. No Danish region mappings are added.

## Source and license

- Source: [GeoNames DK.zip](https://download.geonames.org/export/zip/DK.zip).
- Attribution: GeoNames, <https://www.geonames.org/>.
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- [Source format and accuracy notes](https://download.geonames.org/export/zip/readme.txt).
- Retrieved: 2026-11-04. Archive HTTP Last-Modified: 2026-11-04 02:53:31 GMT.
  This is an export date, not a survey date for each coordinate.
- Extracted `DK.txt` SHA-256:
  `9d8b6736af1fdd94a5b48201400e40f1626b2fab394d1efe659d2277e56acfdc`.

The export has 1,159 rows and 1,159 unique postal codes. No aggregation or duplicate
weighting is needed. The JSON sorts by postal code and copies tab-separated
columns 2, 10, and 11 to `zip`, `latitude`, and `longitude`. Values stay strings,
as in the existing API. Generation checked country DK, four-digit codes, unique
codes, finite coordinates, and WGS84 ranges. No source rows were removed.
Offline tests check all generated rows through the public lookup.

## Input and coverage

The lookup accepts `1050`, `DK-1050`, `dk1050`, and outer whitespace. It uses an
exact full code after DNK-only normalization. It does not remove internal spaces
or accept trailing locality text. Missing codes return `undefined`.
Leading zeros are never removed or padded. For example, `0892` is absent from
this export and returns `undefined`.

The file includes Copenhagen, mainland rural areas, and islands such as Bornholm,
Ærø, and Læsø. It does not establish complete national coverage. Special postal
codes can be absent. Greenland and the Faroe Islands are separate countries;
no points are substituted for them.

## Accuracy and checks

These are approximate postal representative points, not parcel or drop-off
locations. GeoNames marks 1,034 rows with accuracy 6 (address or shape centroid),
2 with accuracy 4, 1 with accuracy 1, and leaves 122 accuracy fields empty.
Do not assume a measured error bound. GeoNames can estimate coordinates from
place names or nearby postal codes. Four decimal places are storage precision,
not proof of positional accuracy. A rural postal area can span many kilometres.

Checked source points, in longitude/latitude order:

- 1050 København K: 12.5857, 55.6806.
- 5970 Ærøskøbing: 10.3895, 54.8771.
- 9990 Skagen: 10.5621, 57.7208.
- 3700 Rønne: 14.7247, 55.1065.

Municipal sources confirm the island and northern-edge postal/locality pairs:
[Ærø municipal contact](https://www.aeroekommune.dk/om-kommunen/kontakt) and
[Skagen municipal library](https://bibl.frederikshavn.dk/skagen-bibliotek).
These checks confirm locality identity, not the exact centroid coordinates.
The [official address guidance](https://danmarksadresser.dk/media/9931/vejledning-i-adressereglerne_1_1_01072020_endelig.pdf)
confirms the four-digit format. No independent distance-error study was done.
