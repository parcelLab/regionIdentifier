# Slovakia postal coordinates

Source: [GeoNames SK.zip](https://download.geonames.org/export/zip/SK.zip),
retrieved 2026-11-04. Attribution: GeoNames, https://www.geonames.org/.
License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), confirmed in
[the postal export readme](https://download.geonames.org/export/zip/readme.txt).
The archive does not specify a dataset revision date.

The source has 5,233 locality rows and 3,480 unique full five-digit postal codes.
Coverage is limited to the codes in this export; national completeness is not
verified. Leading zeros are retained. Output coordinates are decimal-degree
strings, in the existing longitude/latitude lookup order.

For each code, remove duplicate latitude/longitude pairs, then take the unweighted
arithmetic mean of each coordinate and round to six decimal places. This prevents
duplicate locality rows from increasing a point's weight. These are representative
points, not postal-area centroids or address locations. GeoNames can infer points
from place names or neighbouring codes; six decimals do not imply that accuracy.
No distance error bound is available.

To reproduce: read SK.txt as UTF-8 tab-separated rows; use field 2 as the code
(remove its space), fields 10 and 11 as latitude and longitude. Group and aggregate
as above, then sort codes lexically. Validate five digits, finite values, latitude
within [-90, 90], longitude within [-180, 180], and unique output codes.
SHA-256 of SK.txt: `cda413bbb5c4d85228b468d786b6a17bcbc3f4bc7322d896c6568db4fa4e1c12`.

The [GeoNames postal search](https://www.geonames.org/postalcode-search.html?country=SK)
provides locality checks: Žilina 010 01 and rural Terchová 013 06. Terchová
retains its source point; Žilina shares its code with other points, so its output
is their mean. These checks confirm source consistency, not independent survey
accuracy. Compact codes and the standard three-digit, space, two-digit form are
supported. Unknown and malformed codes return undefined.
