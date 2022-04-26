Region Identifier
=============================

Utility module that provides an easy way to identify the region of the country depending on the postal code, brings a set of determined regions for some of the countries and if it doesn't find a match uses google geolocation API to get the region.

ISO codes used for all the regions can be found here: https://en.wikipedia.org/wiki/ISO_3166-2.

**Predefined Regions**
>- AUT
>- BEL
>- CHE
>- DEU 
>- ESP
>- FRA
>- GBR
>- ITA
>- NLD
>- RUS
>- USA

### Test
```sh
$ npm test
```

### License
This module was built using adapted information from http://download.geonames.org/ that's registered under the **CC BY 3.0** as well as this module.
Link to more information about **CC BY 3.0** http://creativecommons.org/licenses/by/3.0/.

### Usage

**Basic:**
```javascript
var RegionIdentifier = requrie('regionIdentifier');
var identifier = new RegionIdentifier('<GOOGLE API KEY>');
```
**Get region:**
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
