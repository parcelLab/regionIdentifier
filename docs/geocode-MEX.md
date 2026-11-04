# Mexico postal coordinates

This dataset supports approximate distance analysis for return locations. It does not locate an address or determine fraud.

## Source and license

- Publisher: [GeoNames](https://www.geonames.org/), [Mexico postal export](https://download.geonames.org/export/zip/MX.zip).
- Retrieved: 2026-11-04. HTTP Last-Modified: 2026-11-04 02:54:07 UTC. This is the export date, not a verified date of postal assignments or coordinates.
- Source documentation: [postal readme](https://download.geonames.org/export/zip/readme.txt), also included in the archive.
- License: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). Credit: GeoNames. This derived dataset groups locality points by postal code, removes repeated coordinate pairs, calculates their mean, rounds to six decimals, and excludes the known error below. The data license applies separately from the repository code license.
- Archive SHA-256: `da4f8bf0a319fb3c871102e3c73d7e7c8b8be58d8b9149804b4cdb2b3b9479ad`.
- Extracted `MX.txt` SHA-256: `281715a2fab329311f86bcaed17cbe8de766d2583a7489fb5a1e25ab4ec9e84a`.

## Coverage and method

The source has 144,655 locality rows, 32,448 distinct five-digit postal codes and all 32 first-level state codes. The output has 32,447 rows and unique postal codes after excluding `23300`. National completeness and current postal assignments have not been established. Region prefix mappings are not used to fill gaps.

For each code, collect distinct numeric `(latitude, longitude)` pairs. Sort them, then calculate the unweighted arithmetic mean of each coordinate. Repeated rows and localities with identical points receive no extra weight. Sort the output by postal code. Store coordinates as decimal strings to retain legacy lookup behavior. The runtime returns `[longitude, latitude]`.

These are representative points, **not postal-area centroids**. GeoNames describes algorithmic place-name matching and estimates from neighboring codes. The source accuracy field has 79,434 rows marked `4`, 45,232 marked `3`, and 19,989 marked `1`; the current readme does not define `3`. No accuracy radius is available. Six decimal places describe storage rounding, not measurement precision. Means can lie outside the served settlements. Rural codes can cover large areas, and source errors can produce large distance errors.

The generator rejects malformed rows, non-five-digit codes, non-finite numbers and out-of-range WGS84 values. It has assert-based checks for aggregation, duplicate neutrality, order independence, the exclusion, and invalid source values. Run without Python optimization:

```sh
unzip -p MX.zip MX.txt > /tmp/MX.txt
python3 scripts/generate-mex-geocode.py /tmp/MX.txt
npx prettier --write geocode/MEX.json
```

## Sample checks and known error

- Urban and leading zero: `01000`, San Ángel, Álvaro Obregón. GeoNames supplies `(19.3587, -99.2033)`. A [federal judiciary notice](https://www.serviciosenlinea.pjf.gob.mx/ServiciosJurisdiccionales/assets/avisos/3984.pdf) confirms the locality and code. This confirms postal identity, not independent point accuracy.
- Rural and high-end code: `99998`, Palmarejo, Moyahua de Estrada. The [IMSS medical-unit directory](https://www.imss.gob.mx/sites/all/statics/imp_directorios/UnidadesMedicasIMSS-2014.pdf) confirms Palmarejo and `99998`. Three distinct source points produce `(21.101533, -103.142133)`. The official directory does not provide coordinates; independent point accuracy remains unverified.
- **Excluded `23300`:** [Baja California Sur government data](https://sepadabcs.gob.mx/transparencia/ltaipebcs/art75/documentos/ordenamiento-pesquero/2021/libro_blanco/fuentes/02_procedimientocontratacion/anexo2_2017_seguro_de_pescadores.pdf) identifies Todos Santos with this code. A [federal reference-coordinate table](https://www.diariooficial.gob.mx/nota_detalle_popup.php?codigo=5748530) places Todos Santos near `(23.450437, -110.225613)`. The source instead includes a Centro point `(24.1562, -110.3169)` near La Paz and yields a mean `(23.807150, -110.127500)`, about 41 km from the official Todos Santos reference. Exclude the entire code rather than substitute an unrelated reference point. Other misplaced source points may remain.

## Input and compatibility

MEX accepts the complete five-digit string, with optional surrounding whitespace. Leading zeros are required. Embedded spaces, prefixes, suffixes, missing codes, and the excluded code return `undefined`. Country aliases retain the existing resolver behavior (`MEX`, `MX`, `Mexico`); lowercase ISO codes remain unsupported. Other countries keep their existing allowlist entries and normalization. Public exports and types do not change.

Offline tests execute the actual lookup, check coordinate order and expected values, and validate all output rows. No network service or production write is required.
