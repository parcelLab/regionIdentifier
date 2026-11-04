"""Build LUX postal representative points from the official BD-Adresses CSV."""

import csv
import json
import math
import sys
from collections import defaultdict
from pathlib import Path


def aggregate(rows):
    points = defaultdict(set)
    for row in rows:
        code = row['code_postal']
        assert len(code) == 4 and code.isascii() and code.isdigit(), code
        longitude, latitude = float(row['lon_wgs84']), float(row['lat_wgs84'])
        assert math.isfinite(longitude) and -180 <= longitude <= 180
        assert math.isfinite(latitude) and -90 <= latitude <= 90
        assert 5.7 <= longitude <= 6.6 and 49.4 <= latitude <= 50.2
        points[code].add((longitude, latitude))
    assert points
    return [
        {
            'zip': code,
            'latitude': f'{sum(p[1] for p in sorted(values)) / len(values):.6f}',
            'longitude': f'{sum(p[0] for p in sorted(values)) / len(values):.6f}',
        }
        for code, values in sorted(points.items())
    ]


if __name__ == '__main__':
    sample = [
        {'code_postal': '0123', 'lon_wgs84': '6', 'lat_wgs84': '49.6'},
        {'code_postal': '0123', 'lon_wgs84': '6.2', 'lat_wgs84': '49.8'},
    ]
    assert aggregate(sample + sample[:1]) == [
        {'zip': '0123', 'latitude': '49.700000', 'longitude': '6.100000'}
    ]
    assert aggregate(reversed(sample)) == aggregate(sample)
    with open(sys.argv[1], encoding='utf-8-sig', newline='') as source:
        data = aggregate(csv.DictReader(source, delimiter=';'))
    destination = Path(__file__).resolve().parents[1] / 'geocode' / 'LUX.json'
    destination.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')
