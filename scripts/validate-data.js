const fs = require('node:fs');
const path = require('node:path');

const Country = require('countryjs');

const coordinates = require('../lib/geocode');
const RegionIdentifier = require('../lib/region');

const ISO3_PATTERN = /^[A-Z]{3}$/;
const NUMERIC_VALUE_PATTERN = /^\d+$/;
const ZIP_CODE_FORMATS = new Set(['numeric', 'alpha']);

const rootDirectory = path.join(__dirname, '..');
const errors = [];

function addError(message) {
  errors.push(message);
}
const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const isPositiveInteger = (value) => Number.isSafeInteger(value) && value > 0;
const isNumericValue = (value) =>
  (typeof value === 'number' && Number.isFinite(value)) ||
  (typeof value === 'string' && NUMERIC_VALUE_PATTERN.test(value));
const sortedValues = (values) =>
  [...values].toSorted((firstValue, secondValue) => firstValue.localeCompare(secondValue));

/** Reads JSON and records parse/read failures instead of stopping validation. */
function readJson(relativePath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(rootDirectory, relativePath), 'utf8'));
  } catch (err) {
    addError(`${relativePath}: invalid JSON (${err.message})`);
    return null;
  }
}

/** Returns ISO3 codes from JSON file names in a data directory. */
function jsonIsoCodes(directoryName) {
  return new Set(
    fs
      .readdirSync(path.join(rootDirectory, directoryName))
      .filter((fileName) => fileName.endsWith('.json'))
      .map((fileName) => path.basename(fileName, '.json')),
  );
}

/** Uses countryjs to reject codes that merely look like ISO3 but are not real countries. */
function isKnownIso3(isoCode) {
  try {
    return Boolean(Country.ISOcodes(isoCode, 'ISO3'));
  } catch {
    return false;
  }
}

/** Validates ISO3 codes from file names and availableCountries sets. */
function validateIsoSources(sources) {
  for (const [sourceName, isoCodes] of Object.entries(sources)) {
    for (const isoCode of isoCodes) {
      // Catch typos such as lowercase codes, ISO2 codes, or arbitrary labels.
      if (!ISO3_PATTERN.test(isoCode)) {
        addError(`${sourceName}: invalid ISO3 code "${isoCode}"`);
      } else if (!isKnownIso3(isoCode)) {
        // Catch values that look like ISO3 but are not known country codes, e.g. "ZZZ".
        addError(`${sourceName}: unknown ISO3 code "${isoCode}"`);
      }
    }
  }
}

/** Ensures one set is fully covered by another, with caller-specific error text. */
function ensureSubset(requiredIsoCodes, availableIsoCodes, describeMissing) {
  for (const isoCode of requiredIsoCodes) {
    if (!availableIsoCodes.has(isoCode)) {
      addError(describeMissing(isoCode));
    }
  }
}

/** Validates per-country postal-code config used by static region lookup. */
function validateCountryConfig(isoCode, config) {
  // country/*.json is read as a config object by static region lookup.
  if (!isPlainObject(config)) {
    addError(`country/${isoCode}.json: expected an object`);
    return;
  }

  // zipCodeFormat controls whether region ranges/lists are interpreted as numbers or strings.
  if (!ZIP_CODE_FORMATS.has(config.zipCodeFormat)) {
    addError(`country/${isoCode}.json: zipCodeFormat must be "numeric" or "alpha"`);
  }

  // Numeric countries need zipCodeLength for zero-padding prefix matches.
  if (config.zipCodeFormat === 'numeric' && !isPositiveInteger(config.zipCodeLength)) {
    addError(
      `country/${isoCode}.json: numeric countries must define positive integer zipCodeLength`,
    );
  }
}

/** Validates display names for region codes returned by static mappings. */
function validateRegionNames(isoCode, regionNames) {
  // regionNames/*.json maps returned ISO 3166-2-like codes to display names.
  if (!isPlainObject(regionNames)) {
    addError(`regionNames/${isoCode}.json: expected an object`);
    return;
  }

  // Empty name maps make getNameFromCountryAndRegion() useless for that country.
  if (Object.keys(regionNames).length === 0) {
    addError(`regionNames/${isoCode}.json: expected at least one region name`);
  }

  for (const [regionCode, regionName] of Object.entries(regionNames)) {
    // Region names are keyed by values such as "DE-TH" or "US-CA".
    if (typeof regionCode !== 'string' || !regionCode.includes('-')) {
      addError(`regionNames/${isoCode}.json: invalid region code "${regionCode}"`);
    }

    // A code without a readable name would still resolve, but display-name lookup would be empty.
    if (typeof regionName !== 'string' || regionName.length === 0) {
      addError(`regionNames/${isoCode}.json: ${regionCode} must have a non-empty name`);
    }
  }
}

/** Validates one regions/*.json entry; empty lists are allowed placeholders. */
function validateRegionMappingEntry({ isoCode, entry, index, regionNames, countryConfig }) {
  const location = `regions/${isoCode}.json[${index}]`;

  // Each regions/*.json item must describe one lookup rule.
  if (!isPlainObject(entry)) {
    addError(`${location}: expected an object`);
    return;
  }

  const hasList = Object.hasOwn(entry, 'list');
  const hasLow = Object.hasOwn(entry, 'low');
  const hasHigh = Object.hasOwn(entry, 'high');

  // The region returned by lookup must also be resolvable to a display name.
  if (typeof entry.region !== 'string') {
    addError(`${location}: region must be a string`);
  } else if (!Object.hasOwn(regionNames, entry.region)) {
    addError(`${location}: region "${entry.region}" is missing in regionNames/${isoCode}.json`);
  }

  // list is an explicit set of supported zip values; empty lists are allowed placeholders.
  if (hasList && !Array.isArray(entry.list)) {
    addError(`${location}: list must be an array`);
  }

  // A mapping without list or low cannot match any zip code.
  if (!hasList && !hasLow) {
    addError(`${location}: expected either list or low`);
  }

  // high only makes sense as the upper bound of a low/high range.
  if (hasHigh && !hasLow) {
    addError(`${location}: high requires low`);
  }

  if (countryConfig?.zipCodeFormat !== 'numeric') {
    return;
  }

  // Numeric country configs compare low/high/list values as numbers.
  for (const key of ['low', 'high']) {
    if (Object.hasOwn(entry, key) && !isNumericValue(entry[key])) {
      addError(`${location}: ${key} must be numeric for numeric country config`);
    }
  }

  // Numeric lists are also used for exact matches and prefix checks.
  if (Array.isArray(entry.list)) {
    for (const [listIndex, value] of entry.list.entries()) {
      if (!isNumericValue(value)) {
        addError(
          `${location}.list[${listIndex}]: value must be numeric for numeric country config`,
        );
      }
    }
  }

  // Reversed ranges would never match correctly.
  if (hasLow && hasHigh && isNumericValue(entry.low) && isNumericValue(entry.high)) {
    const low = Number(entry.low);
    const high = Number(entry.high);

    if (low > high) {
      addError(`${location}: low must not be greater than high`);
    }
  }
}

/** Checks that a JSON file is an array, optionally requiring at least one entry. */
function validateArrayFile(relativePath, value, { allowEmpty = true } = {}) {
  // region and geocode data files are consumed as arrays by the runtime code.
  if (!Array.isArray(value)) {
    addError(`${relativePath}: expected an array`);
    return false;
  }

  // Top-level regions/*.json files must contain mappings; entry-level empty lists are still OK.
  if (!allowEmpty && value.length === 0) {
    addError(`${relativePath}: expected at least one mapping`);
  }

  return true;
}

/** Validates all static region lookup data for one country. */
function validateRegionData(isoCode) {
  const countryConfig = readJson(`country/${isoCode}.json`);
  const regionNames = readJson(`regionNames/${isoCode}.json`);
  const regionMappings = readJson(`regions/${isoCode}.json`);

  validateCountryConfig(isoCode, countryConfig);
  validateRegionNames(isoCode, regionNames);

  if (!countryConfig || !regionNames) {
    return;
  }

  if (validateArrayFile(`regions/${isoCode}.json`, regionMappings, { allowEmpty: false })) {
    regionMappings.forEach((entry, index) => {
      validateRegionMappingEntry({ isoCode, entry, index, regionNames, countryConfig });
    });
  }
}

/** Validates geocode file shape without judging legacy coordinate quality. */
function validateGeocodeData(isoCode) {
  const geocodeMappings = readJson(`geocode/${isoCode}.json`);

  if (geocodeMappings) {
    validateArrayFile(`geocode/${isoCode}.json`, geocodeMappings);
  }
}

/** Prints all collected errors or a short success summary. */
function printResult(dataIsoCodes) {
  if (errors.length === 0) {
    console.log(`Validated region data for ${dataIsoCodes.regions.size} countries.`);
    console.log(`Validated geocode data for ${dataIsoCodes.geocode.size} countries.`);
    return;
  }

  console.error(`Data validation failed with ${errors.length} error(s):`);

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exitCode = 1;
}

const dataIsoCodes = {
  country: jsonIsoCodes('country'),
  regions: jsonIsoCodes('regions'),
  regionNames: jsonIsoCodes('regionNames'),
  geocode: jsonIsoCodes('geocode'),
};
const staticIsoCodes = new Set(RegionIdentifier.availableCountries);
const geocodeIsoCodes = new Set(coordinates.availableCountries);

// Validate country codes from both data file names and runtime allowlists.
validateIsoSources({
  'country': dataIsoCodes.country,
  'regions': dataIsoCodes.regions,
  'regionNames': dataIsoCodes.regionNames,
  'geocode': dataIsoCodes.geocode,
  'lib/region.js availableCountries': staticIsoCodes,
  'lib/geocode.js availableCountries': geocodeIsoCodes,
});

// Every country supported by lib/region.js needs zip config, region mappings, and names.
ensureSubset(
  staticIsoCodes,
  dataIsoCodes.country,
  (isoCode) => `country/${isoCode}.json: missing file`,
);
ensureSubset(
  staticIsoCodes,
  dataIsoCodes.regions,
  (isoCode) => `regions/${isoCode}.json: missing file`,
);
ensureSubset(
  staticIsoCodes,
  dataIsoCodes.regionNames,
  (isoCode) => `regionNames/${isoCode}.json: missing file`,
);

// Every regions/*.json file must have the config and names needed to interpret it.
ensureSubset(
  dataIsoCodes.regions,
  dataIsoCodes.country,
  (isoCode) => `country/${isoCode}.json: missing file`,
);
ensureSubset(
  dataIsoCodes.regions,
  dataIsoCodes.regionNames,
  (isoCode) => `regionNames/${isoCode}.json: missing file`,
);

// lib/geocode.js and geocode/*.json must stay in sync in both directions.
ensureSubset(
  geocodeIsoCodes,
  dataIsoCodes.geocode,
  (isoCode) => `geocode/${isoCode}.json: missing file`,
);
ensureSubset(
  dataIsoCodes.geocode,
  geocodeIsoCodes,
  (isoCode) => `lib/geocode.js availableCountries: missing "${isoCode}"`,
);

// Deep-validate the contents only after the cross-file existence checks are registered.
for (const isoCode of sortedValues(dataIsoCodes.regions)) {
  validateRegionData(isoCode);
}

// Geocode content validation is intentionally shallow because legacy coordinates are noisy.
for (const isoCode of sortedValues(dataIsoCodes.geocode)) {
  validateGeocodeData(isoCode);
}

printResult(dataIsoCodes);
