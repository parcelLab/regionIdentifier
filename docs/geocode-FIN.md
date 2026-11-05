# Finland postal-area coordinates

## Source and licence

- Provider: Statistics Finland, Paavo postal code areas, layer `postialue:pno_2026`.
- [Dataset description](https://stat.fi/en/services/statistical-data-services/geographic-data/geographic-data-by-postal-code-area).
- [WFS download](https://geo.stat.fi/geoserver/postialue/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=postialue:pno_2026&outputFormat=application/json&srsName=EPSG:4326).
- Retrieved: 2026-11-04. Area classification: 2026. The provider lists its latest update as 2026-01-26.
- [Licence and attribution terms](https://stat.fi/en/services/statistical-data-services/open-data-and-interfaces): CC BY 4.0. Attribution: Statistics Finland, Paavo 2026. This repository derives representative coordinates from the source polygons. This attribution applies to FIN data even though the package has a legacy CC BY 3.0 licence label.
- Download SHA-256: `0da243b797b8d5b06d34b0e2e2fb837f5edae68225d7afa530eee3e21db2da00`. The WFS response includes a request timestamp, so a later download can have a different hash.

## Coverage and calculation

The file contains 3,018 records and 3,018 unique five-digit postal-area codes. This is the complete returned 2026 polygon layer, including Åland. It is not a list of all Finnish postal codes: special recipient and PO box codes without a statistical area are not supplied. Missing codes return `undefined`.

Each point is the geometric area centroid of its Polygon or MultiPolygon in the supplied WGS84 longitude/latitude plane. The shoelace formula weights exterior rings by absolute area and subtracts holes. Disconnected parts contribute by area, not vertex count. No locality or duplicate row weighting is used; duplicate postal codes cause generation to fail. The generator result uses six decimal places; the final `geocode:compact` step rounds to four significant digits and preserves coordinate strings. This is an angular-plane centroid, not an equal-area projected, population-weighted or address-weighted centroid. It can lie outside a concave area or in water. Decimal precision does not establish positional accuracy.

Use these points for approximate postal-area distances only. Large rural and northern areas can put the point many kilometres from an actual address. No error bound or site-level accuracy is claimed. No missing code is replaced with another area's center.

## Reproduction and checks

Save the WFS download as a local JSON file. From the repository root, run `node update/fin.js /path/to/download.json`, then `npm run geocode:compact`. The script uses only Node.js built-in modules. It checks the source count and year, duplicate codes, and coordinate bounds. Tests check the centroid formula with squares, holes, and disconnected areas.

Primary-source spot checks use the same official layer's code, name and geometry: `00100` Helsinki center (urban), `98900` Salla center (rural), `99980` Utsjoki center (northern edge), `22100` Mariehamn (Åland), and `21660` Nauvo center (archipelago MultiPolygon). Tests pin the derived coordinates for these areas. These checks confirm area identity and the selected geometry, not independent ground accuracy.

Lookup accepts the five-digit string, including leading zeros, or the existing space-separated locality suffix (`00100 Helsinki`). Country aliases `FIN`, `FI` and `Finland` use the existing resolver. No country-prefixed postal format is added. Other countries' normalization and return types are unchanged.

Run `npm test`, `npm run lint`, `npm run format:check`, and `npm run validate:data`.
