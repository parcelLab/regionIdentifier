"""Generate CHE geocodes from the swisstopo WGS84 CSV (see docs/geocode-CHE.md)."""
import csv
import json
import math
import sys
from collections import defaultdict
from pathlib import Path


def representative(points):
    points = sorted(set(points))
    # Select a source point with the smallest total great-circle angular distance.
    def distance(a, b):
        lon1, lat1, lon2, lat2 = map(math.radians, (*a, *b))
        h = math.sin((lat2 - lat1) / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin((lon2 - lon1) / 2) ** 2
        return 2 * math.asin(math.sqrt(min(1, h)))
    return min(points, key=lambda point: sum(distance(point, other) for other in points))


assert representative([(8, 47), (9, 47), (8, 47)]) == (8, 47)
assert representative([(9, 47), (8, 47)]) == (8, 47)
assert representative([(7, 47), (8, 47), (9, 47)]) == (8, 47)

if __name__ == '__main__':
    groups = defaultdict(set)
    with open(sys.argv[1], encoding='utf-8-sig', newline='') as source:
        for row in csv.DictReader(source, delimiter=';'):
            if not row['Kantonskürzel']:
                continue  # Liechtenstein has no Swiss canton.
            zip_code = row['PLZ4']
            point = (float(row['E']), float(row['N']))
            assert len(zip_code) == 4 and zip_code.isascii() and zip_code.isdigit()
            assert all(math.isfinite(value) for value in point)
            assert -180 <= point[0] <= 180 and -90 <= point[1] <= 90
            groups[zip_code].add(point)
    assert len(groups) > 3000
    data = []
    for zip_code, points in sorted(groups.items()):
        lon, lat = representative(points)
        data.append({'zip': zip_code, 'latitude': str(lat), 'longitude': str(lon)})
    Path(__file__).resolve().parents[1].joinpath('geocode/CHE.json').write_text(json.dumps(data, indent=2) + '\n')
    print(f'{len(data)} unique Swiss postal codes')
