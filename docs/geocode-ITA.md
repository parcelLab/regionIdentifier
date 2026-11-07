# Italy postal-code coordinates

## Source and license

Retrieved 2026-11-04 from [GeoNames IT.zip](https://download.geonames.org/export/zip/IT.zip).
The [download directory](https://download.geonames.org/export/zip/) lists the file as
2026-11-04 03:54 Central European Time. This is a file build date; individual record
observation dates are not supplied.

GeoNames is the publisher of this extract, not the Italian postal authority.
The [postal data readme](https://download.geonames.org/export/zip/readme.txt) licenses
it under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Attribution: GeoNames, https://www.geonames.org/. The generated file is an adapted
extract. These data retain CC BY 4.0 attribution requirements independently of the
repository license.

Downloaded archive SHA-256:
`ec29508233070fce15f2a3973c339b8b01e6167665cc09b8fc0397e80a577097`.

## Coverage and representative points

18,415 source rows produce 4,736 unique five-digit CAP records. Leading zeros are
preserved. Each point is WGS84; lookup returns longitude then latitude as strings,
as before. Exact CAP input and the existing space suffix behavior are unchanged.
Unknown codes return undefined. No runtime or export changes are required.

For each CAP, remove duplicate coordinate pairs. Calculate their arithmetic mean.
Select the source point nearest that mean using squared latitude difference plus
squared longitude difference scaled by cosine of mean latitude. Ties use ascending
latitude then longitude. This avoids duplicate-row weighting, input-order dependence,
and a newly invented point between localities. It is a representative locality
point, not a postal-area centroid or an address coordinate. Different localities
under the same CAP can be far apart, including on separate islands.

GeoNames labels coordinates as estimated and can infer them from nearby postal
codes. No measured distance error bound is available. Four decimal places do not
establish address-level accuracy. Coverage is partial and can include old CAPs.
No missing codes are inferred or filled with region centers.

## Primary-source spot checks

Checked 2026-11-04; these confirm sample CAP/locality associations, not a national
coordinate accuracy audit. Offline lookup tests check broad locality bounds:

- Urban, leading zero: [Roma Capitale contacts](https://www.comune.roma.it/web/it/contatti.page)
  lists 00186 Roma. The selected point is [12.5113, 41.8919].
- Alpine town: [Comune di Bormio places](https://comune.bormio.so.it/it/luoghi/378149)
  lists 23032 Bormio. The point is [10.3701, 46.4672].
- Island: [Comune di Capoliveri](https://www.comune.capoliveri.li.it/) lists 57031.
  The point is [10.3775, 42.7457].
- Known missing current CAP: [Comune di Lampedusa e Linosa](https://www.comune.lampedusaelinosa.ag.it/)
  lists 92031. This extract lacks it and lookup returns undefined. Old 92010 rows
  remain in the source; their selected point is on mainland Sicily. Do not use
  92010 as a reliable location for Lampedusa.

## Rebuild and checks

Download IT.zip, extract IT.txt, then run:

```sh
node scripts/generate-ita-geocode.js /path/to/IT.txt geocode/ITA.json
npm test
npm run lint
npm run format:check
npm run validate:data
```

The generator checks country, CAP format, and finite coordinate ranges. Tests
check all output rows through the actual lookup, uniqueness, locality bounds,
unknown codes, duplicate weighting, input order, and invalid coordinates.

Compared with the previous file (18,373 rows, 4,616 unique CAPs), this extract adds
125 CAPs and removes five absent from the new source: 44100, 04028, 01026, 13834,
and 13852. Those five now return undefined. This follows the source snapshot;
it does not prove that every removed code is invalid.
