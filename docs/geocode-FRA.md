# France postal-code coordinates

## Source and licence

Source: La Poste, Service National de l’Adresse, [Base officielle des codes postaux](https://data.laposte.fr/datasets/laposte-hexasmal).
Downloaded on 2026-11-04 from the [official coordinate CSV](https://data.laposte.fr/data-fair/api/v1/datasets/laposte-hexasmal/metadata-attachments/base-officielle-codes-postaux.csv).
The [metadata](https://data.laposte.fr/data-fair/api/v1/datasets/laposte-hexasmal) reports data updated on 2026-10-08 and the coordinate export updated on 2026-10-31.
La Poste publishes the data under Licence Ouverte / Open Licence. The [government catalogue](https://www.data.gouv.fr/datasets/base-officielle-des-codes-postaux) specifies version 2.0. Retain this attribution and source date when redistributing derived points.

## Coverage and method

Input CSV SHA-256: `fb22ac624d7085b1840061b8090051912d850d276ca7f5e22745b9cd73026a0f`.

The input has 39,192 rows. The output has 6,187 records and 6,187 unique five-digit postal codes. It covers source-listed metropolitan France (including Corsica) and the five overseas departments: Guadeloupe, Martinique, French Guiana, Réunion and Mayotte. Other overseas collectivities and Monaco are excluded by commune INSEE code. This is not a claim of complete postal coverage. CEDEX, special-purpose codes and codes absent from this file are unsupported.

For each postal code, group rows by commune INSEE code. Count each commune once, so repeated locality rows cannot change its weight. Take the arithmetic mean of the commune latitudes and longitudes, then round to six decimal places. Assert that duplicate commune/code pairs have the same coordinates. The source identifies these coordinates as commune centroids. The derived mean is a representative point, **not a postal-area centroid**. It is not weighted by population, area or address count. Six decimal places describe storage precision, not positional accuracy.

Run `node scripts/generate-fra-geocode.js /path/to/base-officielle-codes-postaux.csv`, then run `npm run geocode:compact`. The generator validates code format and finite coordinate ranges. Tests verify that each commune is counted once. No retained in-scope code lacks coordinates.

## Compatibility and checks

The old file had 51,623 locality rows and 20,410 unique codes. Lookup selected the first row. Replacement removes unsupported legacy codes, including generic `75000`, and changes existing points. Unknown codes return `undefined`; there is no substitute point. Coordinates retain the existing `[longitude, latitude]` string result. Runtime code and other countries are unchanged. Five digits and leading zeros are required. The existing optional space-separated locality suffix works; internal spaces and omitted zeros do not.

Offline lookup tests check urban Paris `75001`, shared rural code `01400`, Corsica `20000`, Réunion `97400` and Mayotte `97600` against points derived from the official file. They also check every output lookup, duplicate codes, coordinate ranges and misses. These are source checks, not independent field measurements. Commune-wide points can place different urban postal codes at the same location, and shared rural codes can span large distances. Do not use these points as address or parcel-scan positions.
