"""Build Mexico representative points from the GeoNames MX.txt postal export."""

import csv
import json
import math
import re
import sys
from collections import defaultdict
from pathlib import Path


def aggregate(rows):
    points = defaultdict(set)
    for row in rows:
        assert len(row) == 12 and row[0] == 'MX', 'Expected GeoNames Mexico rows'
        code = row[1]
        assert re.fullmatch(r'\d{5}', code, flags=re.ASCII), 'Invalid postal code'
        latitude, longitude = float(row[9]), float(row[10])
        assert math.isfinite(latitude) and -90 <= latitude <= 90
        assert math.isfinite(longitude) and -180 <= longitude <= 180
        points[code].add((latitude, longitude))
    result = []
    for code, pairs in sorted(points.items()):
        # 23300 includes misplaced La Paz points; see docs/geocode-MEX.md.
        if code == '23300':
            continue
        pairs = sorted(pairs)
        result.append({
            'zip': code,
            'latitude': f'{sum(p[0] for p in pairs) / len(pairs):.6f}',
            'longitude': f'{sum(p[1] for p in pairs) / len(pairs):.6f}',
        })
    return result


def self_check():
    def row(code, latitude, longitude):
        return ['MX', code, '', '', '', '', '', '', '', latitude, longitude, '1']

    first = row('01000', '19', '-100')
    second = row('01000', '21', '-98')
    expected = [{'zip': '01000', 'latitude': '20.000000', 'longitude': '-99.000000'}]
    assert aggregate([first, second, first]) == expected
    assert aggregate([second, first]) == expected
    assert aggregate([row('23300', '24', '-110')]) == []
    for invalid in [row('1000', '19', '-100'), row('01000', 'nan', '-100'),
                    row('01000', '91', '-100'), row('01000', '19', '-181')]:
        try:
            aggregate([invalid])
        except AssertionError:
            continue
        raise AssertionError('Invalid source row accepted')


if __name__ == '__main__':
    self_check()
    source = Path(sys.argv[1])
    with source.open(encoding='utf-8', newline='') as handle:
        data = aggregate(csv.reader(handle, delimiter='\t'))
    assert data, 'Empty source'
    destination = Path(__file__).resolve().parents[1] / 'geocode' / 'MEX.json'
    destination.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')
    print(f'Wrote {len(data)} unique postal codes')
