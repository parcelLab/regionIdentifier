# Australia postcode coordinates

## Source and license

- Publisher: [GeoNames postal-code download](https://download.geonames.org/export/zip/), file [AU.zip](https://download.geonames.org/export/zip/AU.zip).
- Retrieved: 2026-11-04. The archive members have timestamp 2026-11-04 03:53; this is an export date, not a survey date. Individual observation dates are not supplied.
- License: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/), as stated in the [postal readme](https://download.geonames.org/export/zip/readme.txt). Attribution: GeoNames, https://www.geonames.org/. This dataset is adapted by filtering and aggregation. Its CC BY 4.0 terms apply independently of the package's legacy license field.
- Input AU.txt SHA-256: `f5545c174ca9a248a0d191e144db8f975bbf0f13ee1d6239219e4f4ebfad3207`.
- GeoNames is the publisher, not Australia Post. Its [postal source table](https://www.geonames.org/postal-codes-sources.html) does not identify an official AU upstream source. This is a reusable approximate dataset, not an official postcode register.

## Coverage and method

The input contains 18,566 locality rows and 3,170 distinct four-digit postcodes. Retain only accuracy levels 4 (geonameid) and 6 (address or shape centroid) observed in this export. Exclude levels 1–3, including algorithmic estimates. This leaves 16,443 source rows and **3,044 output records / unique postcodes**. A code with no retained rows is absent, not replaced by a region or country point. National coverage is incomplete; 126 input codes are omitted, and completeness of the input is not established.

For each postcode, deduplicate numeric latitude/longitude pairs, sort them, and take the unweighted arithmetic mean of each axis. Round to six decimal places and store strings, consistent with legacy coordinate values. Repeated locality rows at the same point have no extra weight. The output is a mean of supplied points, not a postal-area, population, address-weighted, or first-locality centroid. Six decimal places are storage precision, not measured accuracy.

Coordinates use WGS84. Lookup returns `[longitude, latitude]`. AUS accepts exactly four digits after trimming surrounding whitespace. Leading zeros remain significant; `800`, `20 00`, and `2000 NSW` do not match. Country resolution remains unchanged. Unknown or omitted codes return `undefined`. Other countries keep their existing behavior. No public export or type changes are required; the coordinate function remains in `lib/geocode.js`.

## Primary-source sample checks and limits

Checked on 2026-11-04:

- Urban: Australia Post identifies [2000 as Sydney](https://auspost.com.au/postcode/2000). The output is approximately 151.2044 E, 33.8655 S, near the [UNGEGN Sydney reference](https://ungegn.un.org/dashboard/cities/details?id=539) (151.2167 E, 33.8833 S). This checks the city vicinity, not a postcode boundary or exact centroid.
- Leading zero: Australia Post identifies [0800 as Darwin City](https://auspost.com.au/postcode/0800). Both retained locality points are near 130.8416 E, 12.4610 S. The offline lookup test preserves the leading zero.
- Rural: Australia Post identifies [4482 as Birdsville](https://auspost.com.au/postcode/birdsville). Its GeoNames shape/address point is 139.8666 E, 25.8149 S, about 53 km from the [Queensland Government Birdsville aviation facility](https://www.tmr.qld.gov.au/community-and-environment/planning-and-development/planning-and-development-assessment-under-the-planning-act/strategic-airports-aviation-facilities-state-interest/location-aviation-facilities) (139.3535 E, 25.8959 S). It is not a town-center point. This demonstrates the material rural-distance limit.
- External islands: input 2899 (Norfolk), 6798 (Christmas), and 6799 (Cocos) have accuracy 1 and mainland coordinates. They are excluded. Lord Howe 2898 is retained at 159.0683 E, 31.5279 S; this does not establish complete territory coverage.

Large rural postcodes can span hundreds of kilometres (for example 0872). A single mean can fall away from any locality. PO box and special-use codes can also remain in the retained data. Do not use these points as proof of a physical scan location or a precise delivery address. No error bound, fraud decision, routing distance, or distance product is supplied.

## Regeneration and offline checks

Download AU.zip, extract AU.txt, and verify its hash for this snapshot. From the repository root:

```sh
node scripts/generate-aus-geocode.js /path/to/AU.txt > geocode/AUS.json
npx prettier --write geocode/AUS.json
npm test
npm run lint
npm run format:check
npm run validate:data
```

The generator rejects malformed country codes, postcode formats, blank/nonfinite/out-of-range coordinates, and invalid accuracy values. Tests check duplicate-row invariance, source-order invariance, filtering, invalid input, representative results, unknown codes, dataset uniqueness/ranges, and every generated record through the actual lookup. No network is needed for the tests.
