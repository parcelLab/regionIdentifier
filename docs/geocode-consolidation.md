# Consolidated postal geocoding

This change integrates country PRs #95–123 into one review. It refreshes ten existing datasets and adds nineteen, for 29 supported geocode countries. Every source PR head remains in the commit history. Country datasets, source documents, generators, and fixtures are unchanged from those PRs.

The shared runtime combines the country-specific normalization rules. Three tests in the CZE/NOR/POL branches used the old German point for 01945; their expectations now use the refreshed DEU dataset. Region-name mappings and the string `[longitude, latitude]` return contract are unchanged.

## Country sources

| Country | Source PR                                                      | Source commit                              | Method and limits              |
| ------- | -------------------------------------------------------------- | ------------------------------------------ | ------------------------------ |
| AUS     | [#116](https://github.com/parcelLab/regionIdentifier/pull/116) | `35b965834ef379925f70c46291a7d7aeb900d2a8` | [Source notes](geocode-AUS.md) |
| AUT     | [#96](https://github.com/parcelLab/regionIdentifier/pull/96)   | `16de9dcc5eb463805884ea99b1fc8101bfe94be9` | [Source notes](geocode-AUT.md) |
| BEL     | [#103](https://github.com/parcelLab/regionIdentifier/pull/103) | `9d1f93f84f22d7bad6b6b7d2217f6d84646d3231` | [Source notes](geocode-BEL.md) |
| CAN     | [#117](https://github.com/parcelLab/regionIdentifier/pull/117) | `cc5b202be615021bbd0811b0a8fe565450212c1c` | [Source notes](geocode-CAN.md) |
| CHE     | [#101](https://github.com/parcelLab/regionIdentifier/pull/101) | `ac17aad20e7d682e2c8a29142a1a3e0d1067920d` | [Source notes](geocode-CHE.md) |
| CZE     | [#122](https://github.com/parcelLab/regionIdentifier/pull/122) | `5b7a754d0be49e98832f43a2e30fd88a329bc700` | [Source notes](geocode-CZE.md) |
| DEU     | [#98](https://github.com/parcelLab/regionIdentifier/pull/98)   | `0221eff82268f00a0e7667599db52bbb2d66557c` | [Source notes](geocode-DEU.md) |
| DNK     | [#121](https://github.com/parcelLab/regionIdentifier/pull/121) | `8ed3d30923ae09a5c046a107fca7f915daba5268` | [Source notes](geocode-DNK.md) |
| ESP     | [#99](https://github.com/parcelLab/regionIdentifier/pull/99)   | `0669f5de7df6a9c2e4a8271498f30aa9b8dda785` | [Source notes](geocode-ESP.md) |
| FIN     | [#109](https://github.com/parcelLab/regionIdentifier/pull/109) | `18713b9b0032d442a2cf9fc7574bccc8b9139f4b` | [Source notes](geocode-FIN.md) |
| FRA     | [#97](https://github.com/parcelLab/regionIdentifier/pull/97)   | `87b4812f841c0f7dc782c6746de23cf7263a49b1` | [Source notes](geocode-FRA.md) |
| GBR     | [#115](https://github.com/parcelLab/regionIdentifier/pull/115) | `73ab140b5b7f17ca3187d3b059acf9a61bfcf69d` | [Source notes](geocode-GBR.md) |
| HUN     | [#106](https://github.com/parcelLab/regionIdentifier/pull/106) | `b92dc74243fdcd35dd9ef5e67b61cc17b6595347` | [Source notes](geocode-HUN.md) |
| IRL     | [#113](https://github.com/parcelLab/regionIdentifier/pull/113) | `a02b6c71aa7e143b2964f5ecd5f51bd7f09e2281` | [Source notes](geocode-IRL.md) |
| ITA     | [#114](https://github.com/parcelLab/regionIdentifier/pull/114) | `35a1ea73c48ae6ec8cc25403512f4a8a68dcd3b2` | [Source notes](geocode-ITA.md) |
| JPN     | [#111](https://github.com/parcelLab/regionIdentifier/pull/111) | `56a959e72cd96202cbccbaddbf2b6882a5fc6945` | [Source notes](geocode-JPN.md) |
| KOR     | [#105](https://github.com/parcelLab/regionIdentifier/pull/105) | `1745dd61fa64c03d70c3a5cdf882a7286027c4f2` | [Source notes](geocode-KOR.md) |
| LTU     | [#110](https://github.com/parcelLab/regionIdentifier/pull/110) | `f07a74f719222cc6df9cbffbd02f8772dfb24ba6` | [Source notes](geocode-LTU.md) |
| LUX     | [#102](https://github.com/parcelLab/regionIdentifier/pull/102) | `7319519f5d5b9017d6edb47b1ad50bbb2b82e87d` | [Source notes](geocode-LUX.md) |
| MEX     | [#119](https://github.com/parcelLab/regionIdentifier/pull/119) | `b86d5efe8da3e4346f4dc011dbd2b081ef22b996` | [Source notes](geocode-MEX.md) |
| NLD     | [#108](https://github.com/parcelLab/regionIdentifier/pull/108) | `253576c1f85e0f0a8c803ead1ee3447bac095f8f` | [Source notes](geocode-NLD.md) |
| NOR     | [#123](https://github.com/parcelLab/regionIdentifier/pull/123) | `556861d074aaaa0c7df02ac5c26d698408e4952e` | [Source notes](geocode-NOR.md) |
| POL     | [#120](https://github.com/parcelLab/regionIdentifier/pull/120) | `e724cb741103765e9d9a4c136e88e94aafe9f6bd` | [Source notes](geocode-POL.md) |
| PRT     | [#107](https://github.com/parcelLab/regionIdentifier/pull/107) | `59fa74e13a1757f9997701d2bfd048e03cb24ebf` | [Source notes](geocode-PRT.md) |
| ROU     | [#112](https://github.com/parcelLab/regionIdentifier/pull/112) | `8fa4cb596f9de2b971804f9a933fa50d81b1bf86` | [Source notes](geocode-ROU.md) |
| SRB     | [#100](https://github.com/parcelLab/regionIdentifier/pull/100) | `a8ca359d082393a2cd720df88f3cf81f3daf0037` | [Source notes](geocode-SRB.md) |
| SVK     | [#95](https://github.com/parcelLab/regionIdentifier/pull/95)   | `6cc5c6a4fa1891269f731dc335983cf245927930` | [Source notes](geocode-SVK.md) |
| SWE     | [#104](https://github.com/parcelLab/regionIdentifier/pull/104) | `38d6da6b06150fb7d508740929d2ffccab2c3a74` | [Source notes](geocode-SWE.md) |
| USA     | [#118](https://github.com/parcelLab/regionIdentifier/pull/118) | `fb5c19ff8f3cecf741f9a307d255620faaa1df4e` | [Source notes](geocode-USA.md) |

## Open source blockers

Brazil, India, Russia, and Turkey are not added. Brazil has incomplete CEP coverage and an unverified alternative derivation/license. India has a large reference-coordinate discrepancy and unavailable official source checks. Russia lacks sufficient primary coordinate verification. Turkey has widely separated points for the same code and an unavailable official lookup. Archiving the investigation chats does not resolve these blockers.

## Review limits

- These points are approximate locality representatives, means, or centroids, not scan-site coordinates. Source-specific licenses and attribution remain in each country document.
- CA/GB/NL/IE use FSA/district/prefix/routing-key precision. Different addresses can resolve to the same point.
- Source replacement reduces some legacy coverage: France 20,410 unique entries to 6,187 codes; Belgium removes 29; Germany removes 12; USA removes nine Pacific codes. Absence from the replacement source does not establish invalidity.
- Japan and Portugal add large datasets. Runtime lookup remains a linear scan; no production performance claim is made.
- No package version bump, publication, deployment, or master merge is part of this consolidation.

## Validation

The combined suite has 171 tests. Lint, formatting, and data validation are checked on the combined branch. A consolidation audit compares all 29 source heads with the integrated history, verifies unchanged country assets, and compares 604,260 postcode-normalization inputs with the original country branches.
