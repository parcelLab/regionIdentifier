# Ireland routing-key coordinates

## Source and license

- Source: [GeoNames IE.zip](https://download.geonames.org/export/zip/IE.zip), `IE.txt`.
- Attribution: postal data from [GeoNames](https://www.geonames.org/), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See the [postal data readme](https://download.geonames.org/export/zip/readme.txt).
- Retrieved: 2026-11-04. The archive and download index show 2026-11-04 03:53 (index time zone: Central European Time). This is a dump date, not a survey date.
- IE.txt SHA-256: `3c234a80cb983eafddc07f61e39616cee3cc49e551a9f76468470b65cfef6f40`.

## Coverage and precision

The file has 139 rows and 139 unique three-character routing keys. Coverage is partial: for example, A65, used in the official Eircode example, is absent. No missing keys or coordinates were generated. Northern Ireland uses GBR postcodes and is outside this dataset.

These are GeoNames WGS84 named-place points, not routing-area centroids or address locations. The source marks most rows with accuracy 4 (geonameid); Dublin district rows have no accuracy value. GeoNames describes its coordinates as estimates and gives no completeness or positional error guarantee. Decimal places do not establish accuracy.

Each routing key returns the source point for its named place. No aggregation is required: there are no duplicate keys. Conversion copies postal code, latitude and longitude from tab-separated columns 2, 10 and 11, preserves coordinate strings, and sorts by key. The import asserted 139 unique rows and finite coordinates within Ireland's approximate bounds. Offline tests repeat those checks and execute every lookup.

## Input behavior

IRL accepts a routing key or a seven-character Eircode, with an optional space between its two parts. Input is trimmed and converted to uppercase. The full code is checked for syntax, then reduced to its first three characters. D6W is supported; zeros in keys such as D01 are retained. Unknown keys and malformed inputs return `undefined`. A valid suffix is not proof that the address exists. Results keep the existing `[longitude, latitude]` string format. Other countries retain their existing behavior.

## Primary-source checks

Checked on 2026-11-04:

- [Eircode's format description](https://www.eircode.ie/what-is-eircode) confirms the three-character routing key, four-character unique identifier, and A65 F4E2 example. [Eircode FAQs](https://www.eircode.ie/faqs) confirm Dublin's D01–D24 and D6W keys.
- Urban: [National College of Ireland](https://www.ncirl.ie/About/Location/IFSCCampusMap) lists Dublin 1, D01 N6P6. The source point (53.354, -6.2545) is a Dublin 1 locality point.
- Rural south-west: [Bantry Branch Office](https://www.gov.ie/en/department-of-social-protection/intreo-centres/bantry-branch-office/) lists Bantry, P75 RY96. The source point (51.6833, -9.45) represents Bantry town, not the full rural area.
- North-west: [HSE Bundoran Health Centre](https://www2.hse.ie/services/primary-care-centres/bundoran-health-centre/) lists Bundoran, F94 DR52. The source point (54.4778, -8.2809) represents Bundoran.

These checks support key-to-place associations and broad geographic plausibility. They do not independently certify the coordinates or measure distance error. Full address geocoding requires separately licensed address data; see [Eircode products](https://www.eircode.ie/business/products-and-services).

## Distance limit

All addresses with the same key resolve to the same point. Within-key distance is therefore zero, even for distinct places. Large routing areas can cause substantial distance error. Use this data only for coarse analysis; do not use it to establish exact drop-off distance or fraud decisions.
