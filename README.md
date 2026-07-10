# Region Identifier

Utility module that identifies a country's region from a postal code. It first uses the static region mappings bundled in this repository. If no static mapping is available or no static match is found, it falls back to the Google Maps Geocoding API.

## Relevant links

- https://en.wikipedia.org/wiki/ISO_3166-2 — region codes used by this package
- https://en.wikipedia.org/wiki/Category:Postal_codes_by_country — postal-code structure by country
- https://download.geonames.org/export/zip/ — GeoNames postal-code files

## Predefined regions

- AUS
- AUT
- BRA
- BEL
- CAN
- CHE
- DEU
- ESP
- FIN
- FRA
- GBR
- HUN
- IND
- IRL
- ITA
- JPN
- KOR
- LTU
- LUX
- MEX
- NLD
- PRT
- RUS
- ROU
- SVK
- SRB
- SWE
- TUR
- USA

## Usage

### Basic setup

```js
const { RegionIdentifier } = require('region_identifier');

const identifier = new RegionIdentifier('<GOOGLE API KEY>');
```

### Get a region

`get(country, zipCode)` accepts country names, ISO2 codes, or ISO3 codes. It returns a tuple: `[region, googleUsed]`.

```js
const { RegionIdentifier } = require('region_identifier');

const identifier = new RegionIdentifier('<GOOGLE API KEY>');

async function main() {
  const [region, googleUsed] = await identifier.get('DEU', '6578');

  console.log(region); // DE-TH
  console.log(googleUsed); // false when static data matched, true when Google Maps was used
}

main().catch(console.error);
```

Examples:

```js
await identifier.get('Deutschland', '6578'); // ['DE-TH', false]
await identifier.get('DEU', '6578'); // ['DE-TH', false]
await identifier.get('DE', '6578'); // ['DE-TH', false]
```

If the static data does not contain a matching region, `get()` uses Google Maps. In that case `googleUsed` is `true`. Google API request failures are thrown as `GoogleMapsAPIError`.

### Get a region display name

```js
const name = identifier.getNameFromCountryAndRegion('DEU', 'DE-TH');

console.log(name); // Thüringen
```

## Development

```sh
npm test
npm run lint
npm run format:check
npm run validate:data
```

`npm run validate:data` checks consistency between `country/*.json`, `regions/*.json`, `regionNames/*.json`, `geocode/*.json`, and the statically supported countries in `lib/region.js` and `lib/geocode.js`.

See [DATA_REQUIREMENTS.md](./DATA_REQUIREMENTS.md) for the country-data format and checklist.

## License

This module was built using adapted information from http://download.geonames.org/, which is registered under **CC BY 3.0**, as is this module. See http://creativecommons.org/licenses/by/3.0/ for more information.
