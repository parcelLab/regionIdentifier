# Poland postal geocoding

## Source and license

Data: [GeoNames PL.zip](https://download.geonames.org/export/zip/PL.zip), retrieved
2026-11-04. The export directory reported 2026-11-04 03:54 CET. This is the
export date; GeoNames does not provide a source survey date for each row.
Attribution: GeoNames, https://www.geonames.org/.
The [postal data readme](https://download.geonames.org/export/zip/readme.txt)
licenses this data under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
This license applies to the derived POL dataset, independently of the package license.

Archive SHA-256: `1b2efd95141c7856f5bb6d130bb3a37affd401ee4d4a48b245965a5895ada103`.
Extracted PL.txt SHA-256: `21a43be2bed7b8403072f0427c1fce4517a9ae575c4b5596901b9e76cb3ef9a0`.

## Coverage and method

72,899 source rows produce 20,299 unique full `NN-NNN` postcodes. All source rows
have accuracy field 6, but this does not establish the accuracy of the derived
postal point. 3,362 codes have multiple distinct coordinate pairs.

For each code, remove duplicate WGS84 coordinate pairs, sort the pairs, then take
the arithmetic mean of longitude and latitude separately. Round to six decimal
places and store strings to preserve the existing return type. This gives each
distinct point equal weight. It avoids weighting by duplicate locality rows.
It is an approximate representative point, not a postal boundary centroid,
address, parcel position, or population-weighted point. Six decimal places are
storage precision, not measured accuracy.

Reproduce with Node.js:

```sh
curl -fsS https://download.geonames.org/export/zip/PL.zip -o /tmp/PL.zip
unzip -p /tmp/PL.zip PL.txt > /tmp/PL.txt
node scripts/generate-geocode-pol.js /tmp/PL.txt
npm run geocode:compact
```

The script checks source shape, country, code format, finite coordinate ranges,
and duplicate-independent aggregation. The export URL changes over time; compare hashes before reproduction.

## Input and checks

Poczta Polska specifies five digits with a hyphen after the first two digits in
its [postal regulations](https://www.poczta-polska.pl/wp-content/uploads/2024/12/regulaminu-swiadczenia-uslug-powszechnych-01-02-2026_www.pdf).
Lookup accepts `00-002`, compact `00002`, `00 002`, and outer whitespace. It retains
leading zeros. Other formats and missing codes return `undefined`. Other countries
retain their existing normalization. Region mappings are independent and unchanged.

Offline tests execute the public lookup and check urban Warsaw `00-002`, rural
`38-713`, coastal/border `72-600`, and multi-point `59-700`. Primary checks:

- [Government procurement notice](https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/08df0433-46a7-a19e-ab56-9400012f2481)
  associates `00-002` with Warsaw.
- [Lutowiska municipality](https://samorzad.gov.pl/web/gmina-lutowiska/gdzie-spac)
  lists several settlements under `38-713`. The mean of 16 distinct points is
  therefore a broad rural representative, not the town hall position.
- [Świnoujście city contact](https://www.swinoujscie.pl/) confirms `72-600`.
- [Warsaw's postal facility list](https://warszawa19115.pl/documents/20184/1344328/Lista%2Bplac%25C3%25B3wek%2Bpocztowych/2812fa07-ce74-418b-95c0-acd6b0ebb4e5)
  includes `00-001`, absent from this GeoNames export. It remains unsupported.

These checks verify sample postcode/locality associations, not coordinate accuracy.
No complete national comparison or surveyed coordinate check was done. GeoNames
warns that coordinates can be inferred from place names or neighbouring codes.
Some source assignments can be stale or incorrect. Rural codes can cover many
kilometres, and means can lie between settlements. Use only for approximate
distance analysis; do not use this data alone for fraud decisions or routing.
