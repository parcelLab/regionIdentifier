# Country Data Requirements
Guide for adding a new country to the static Region Identifier dataset. Each supported country needs three JSON files plus a small code change.

## 1) Country config – `country/ISO3.json`
- Keys:
  - `zipCodeFormat`: `"numeric"` or `"alpha"`.
  - `zipCodeLength`: integer, required for numeric formats to pad/compare values (USA=5, AUS=4, DEU=5, etc.). Omit for alpha formats (CAN/GBR/NLD).
- Example:
```json
{ "zipCodeFormat": "numeric", "zipCodeLength": 5 }
```

## 2) Region names – `regionNames/ISO3.json`
- Plain object mapping ISO 3166-2 region codes (same codes used in `regions/*.json`) to display names in English.
- Example (`regionNames/AUS.json`):
```json
{
  "AU-NSW": "New South Wales",
  "AU-VIC": "Victoria"
}
```

## 3) Region mappings – `regions/ISO3.json`
Array of objects that map postal codes to ISO 3166-2 region codes. Formats already used in the repo:
- **Numeric intervals** (inclusive): objects with `low`, `high`, `region`. Values can be numbers or numeric strings if leading zeros matter. Example (`regions/AUS.json`):
```json
{ "region": "AU-NSW", "low": 1000, "high": 1999 }
```
- **Explicit codes**: objects with `low`, `region`, no `high`. Every postal code (or prefix) must be listed. Use strings to preserve zeros. Examples:
  - Belgium lists every 4-digit code (`regions/BEL.json`).
  - Spain lists 5-digit codes as strings (`regions/ESP.json`).
  - Mexico lists 2-digit prefixes (`regions/MEX.json`).
  - CAN/GBR use alpha prefixes (e.g., `"low": "X0A"` or `"low": "AB"`).
- **Discrete lists**: objects with `region` and `list` (array of codes). Numeric countries store numbers; matching uses `zipCodeLength` to pad leading zeros before comparison. Examples: USA (`list` of 5-digit numbers), RUS (per-region lists).

Additional format notes:
- Files can mix formats if needed. Order matters because the lookup stops at the first match.
- Intervals and lists are treated as inclusive ranges; for alpha codes only exact equality is used.
- Keep codes as strings when leading zeros are significant.

## 4) Code wiring
- Add the ISO3 code to `availableCountries` in `lib/region.js`; otherwise the static data is ignored and Google is used.
- If the country needs custom postal-code normalization, extend `validateZipCode` (see existing cases for GBR, CAN, NLD, MEX).

## 5) Testing
- Add test cases to `test/tests.js` under `countriesPostalCodes`: include the country ISO/name, a representative zip, expected region code, and set `usingGoogle: false`.
- Run `npm test` to execute Mocha tests.
- Optional: verify pretty-name lookups via `getNameFromCountryAndRegion` using the `regionNames` file.

## 6) Data quality checklist
- Region codes must be valid ISO 3166-2 for the country.
- `regionNames` should be English and cover every region code present in `regions/ISO3.json`.
- Postal-code coverage should include territories and edge prefixes (e.g., US territories, Canadian northern prefixes).
- Prefer ascending ordering of `regions` entries to keep matching predictable.
- Avoid empty mappings; placeholders (e.g., empty lists) will yield null regions and fall back to Google.
