interface CountryIso {
  alpha2: string;
  alpha3: string;
}

export class RegionIdentifier {
  constructor(apikey: string);

  get(country: string, zipCode: string): Promise<[region: string | null, googleUsed: boolean]>;

  getNameFromCountryAndRegion(country: string, region: string): string | null;

  detectWithGoogle(countryIso: CountryIso, zipCode: string): Promise<string | null>;
}

export class GoogleMapsAPIError extends Error {}
