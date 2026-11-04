"""Generate POL points: python3 scripts/generate-geocode-POL.py /path/to/PL.txt."""

import json
import math
import re
import sys
from collections import defaultdict
from pathlib import Path


def generate(lines):
    points = defaultdict(set)
    for line in lines:
        row = line.rstrip('\n').split('\t')
        assert len(row) == 12 and row[0] == 'PL', 'Expected GeoNames PL row'
        assert re.fullmatch(r'\d{2}-\d{3}', row[1]), 'Invalid postcode'
        latitude, longitude = float(row[9]), float(row[10])
        assert math.isfinite(latitude) and -90 <= latitude <= 90
        assert math.isfinite(longitude) and -180 <= longitude <= 180
        points[row[1]].add((longitude, latitude))
    assert points, 'Empty source'
    return [
        {
            'zip': code,
            'latitude': f'{sum(p[1] for p in sorted(values)) / len(values):.6f}',
            'longitude': f'{sum(p[0] for p in sorted(values)) / len(values):.6f}',
        }
        for code, values in sorted(points.items())
    ]


if __name__ == '__main__':
    first = 'PL\t00-002\tPlace\t\t\t\t\t\t\t52\t20\t6\n'
    second = first.replace('52\t20', '54\t22')
    assert generate([first, second, first]) == [
        {'zip': '00-002', 'latitude': '53.000000', 'longitude': '21.000000'}
    ]
    with open(sys.argv[1], encoding='utf-8') as source:
        result = generate(source)
    target = Path(__file__).resolve().parents[1] / 'geocode/POL.json'
    target.write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
    print(f'Wrote {len(result)} unique postcodes')
