# Spain postal-code coordinates

## Source and license

- Source: [GeoNames ES.zip](https://download.geonames.org/export/zip/ES.zip).
- Retrieved: 2026-11-04. The download index reports 2026-11-04 03:53 CET. This is an export date, not the observation date of each locality.
- Archive SHA-256: `5545722d5aa281814fba73e7a5d5fbbb34c3e50129f49d99d7d1a19b336365e3`.
- Attribution: GeoNames, [postal-code documentation](https://download.geonames.org/export/zip/readme.txt), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The data license applies to this derived file independently of the package license.

## Coverage and method

The source has 37,867 locality rows and 11,150 unique five-digit postal codes. The output has one row per code. Coverage includes mainland Spain, the Balearic and Canary Islands, Ceuta, and Melilla. National completeness is not established. The previous file had 37,866 rows and 11,149 unique codes.

For each postal code, take distinct numeric latitude/longitude pairs, sort them, and compute their unweighted arithmetic mean. Round each coordinate to four decimal places. Duplicate rows and locality aliases at the same point do not receive extra weight. There are 4,140 codes with more than one distinct point. This method is deterministic and removes the old first-row bias. It does not calculate a postal-area or address centroid. The point can lie outside the postal area.

Coordinates are estimated WGS84 locality points. Source accuracy flags: 3,352 rows at level 1 (estimated), 13,257 at level 3, and 21,258 at level 4 (geonameid). GeoNames can estimate coordinates from nearby codes when it cannot match a place. Four decimal places describe storage precision, not positional accuracy. No measured distance-error bound is available. Use these points for approximate distance only, with care in rural areas and codes with dispersed localities.

## Compatibility and checks

No runtime wiring changes are needed: ESP is already supported. Return order stays `[longitude, latitude]`, with string values. Leading zeros remain required. Existing parsing accepts a five-digit code followed by a space and locality text. Internal spaces, numeric inputs, or omitted leading zeros are not added as new formats.

Offline tests execute the actual lookup for Madrid (28001), Barcelona (08001), Agurain/Salvatierra (01200), Las Palmas (35001), Palma (07001), Ceuta (51001), and Melilla (52001). They check unknown codes, leading zeros, coordinate bounds, uniqueness, and a multi-locality mean (04114).

Primary-source cross-checks confirm postal associations, not survey accuracy:

- [Madrid city directory](https://www.madrid.es/portales/munimadrid/es/Oficinas-de-Correos-de-Madrid/?vgnextchannel=61600c10c6b05810VgnVCM1000001d4a900aRCRD&vgnextoid=51037cb19ef05810VgnVCM2000001f4a900aRCRD): 28001 Madrid.
- [Basque Government health directory](https://www.euskadi.eus/osi-araba-puntos-atencion-continuada/web01-s2ing/es/): 01200 Agurain, a rural service location.
- [Correos procurement schedule](https://cswetwebcorsta01.blob.core.windows.net/uploads/2025/05/Pliego-de-Condiciones.pdf): 51001 Ceuta and 52001 Melilla.

These checks agree with GeoNames locality names and plausible coordinate locations. They do not independently establish each coordinate. Correos provides an [official commercial database](https://www.correos.es/es/es/empresas/marketing/identifica-a-tus-clientes-potenciales/base-de-datos-de-codigos-postales); it was not copied.

## Rebuild

Extract `ES.txt` from the linked archive, then run:

```sh
python3 scripts/generate-esp-geocode.py /path/to/ES.txt
```

The generator validates every source row and has an assert-based duplicate-weighting check. Do not run Python with assertions disabled. Run the repository tests, lint, format check, and data validator after regeneration.
