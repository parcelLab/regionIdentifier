# Region Identifier

Utility module that provides an easy way to identify the region of the country depending on the postal code, brings a set of determined regions for some of the countries and if it doesn't find a match uses google geolocation API to get the region.

*Relevant links:*
* https://en.wikipedia.org/wiki/ISO_3166-2 — codes used for all the regions can be found here
* https://en.wikipedia.org/wiki/Category:Postal_codes_by_country - explanations of postal code structure per country
* https://download.geonames.org/export/zip/ - all the Geoname files for download (see below)

#### Predefined Regions
- AUT
- BEL
- CAN
- CHE
- DEU
- ESP
- FIN
- FRA
- GBR
- ITA
- MEX
- NLD
- RUS
- SWE
- USA

## Test
```sh
$ npm test
```

### License
This module was built using adapted information from http://download.geonames.org/ that's registered under the **CC BY 3.0** as well as this module.
Link to more information about **CC BY 3.0** http://creativecommons.org/licenses/by/3.0/.

## Usage

#### Basic:
```javascript
const RegionIdentifier = requrie('regionIdentifier');
const identifier = new RegionIdentifier('<GOOGLE API KEY>');
```
#### Get region:
```javascript
//Using country name
identifier.get('Deutschland', '6578', function(err, region) {
    console.log(err, region); // null DE-TH
});

//using ISO3 code
identifier.get('DEU', '6578', function(err, region) {
    console.log(err, region); // null DE-TH
});

//using ISO2 code
identifier.get('DE', '6578', function(err, region) {
    console.log(err, region); // null DE-TH
});
```
