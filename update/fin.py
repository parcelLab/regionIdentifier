"""Build FIN coordinates from a downloaded Paavo 2026 WGS84 GeoJSON file."""

import hashlib
import json
import math
import sys
from pathlib import Path


def center(polygons):
    area = x = y = 0
    for polygon in polygons:
        for index, ring in enumerate(polygon):
            a = cx = cy = 0
            for (x1, y1), (x2, y2) in zip(ring, ring[1:]):
                cross = x1 * y2 - x2 * y1
                a += cross
                cx += (x1 + x2) * cross
                cy += (y1 + y2) * cross
            assert a != 0
            weight = abs(a) * (1 if index == 0 else -1)
            area += weight
            x += cx / (3 * a) * weight
            y += cy / (3 * a) * weight
    assert area > 0
    return x / area, y / area


square = [[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]]
hole = [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]
assert center([[square]]) == (1, 1)
assert center([[square, hole]]) == (7 / 6, 7 / 6)
assert center([[square], [[[4, 0], [6, 0], [6, 2], [4, 2], [4, 0]]]]) == (3, 1)

source = Path(sys.argv[1])
data = json.loads(source.read_text())
assert data['crs']['properties']['name'] == 'urn:ogc:def:crs:EPSG::4326'
assert data['numberReturned'] == data['numberMatched'] == len(data['features']) == 3018
rows = []
seen = set()
for feature in data['features']:
    properties = feature['properties']
    geometry = feature['geometry']
    code = properties['posti_alue']
    assert properties['vuosi'] == 2026
    assert len(code) == 5 and code.isascii() and code.isdigit() and code not in seen
    assert geometry['type'] in ('Polygon', 'MultiPolygon')
    polygons = geometry['coordinates']
    if geometry['type'] == 'Polygon':
        polygons = [polygons]
    lon, lat = center(polygons)
    assert math.isfinite(lon) and math.isfinite(lat)
    assert 19 < lon < 32 and 59 < lat < 71
    seen.add(code)
    rows.append(dict(zip=code, latitude=f'{lat:.6f}', longitude=f'{lon:.6f}'))

Path('geocode/FIN.json').write_text(
    json.dumps(sorted(rows, key=lambda row: row['zip']), indent=2) + '\n'
)
print(f'{len(rows)} postal areas; source SHA-256: {hashlib.sha256(source.read_bytes()).hexdigest()}')
