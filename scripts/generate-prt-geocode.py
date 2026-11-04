"""Convert GeoNames PT.txt to PRT JSON: python3 scripts/generate-prt-geocode.py PT.txt."""

import csv
import json
import math
import re
import sys
from collections import defaultdict
from pathlib import Path


def convert(rows):
    points = defaultdict(set)
    for row in rows:
        assert len(row) == 12 and row[0] == 'PT'
        assert re.fullmatch(r'\d{4}-\d{3}', row[1])
        latitude, longitude = float(row[9]), float(row[10])
        assert math.isfinite(latitude) and -90 <= latitude <= 90
        assert math.isfinite(longitude) and -180 <= longitude <= 180
        points[row[1]].add((latitude, longitude))
    return [
        dict(zip=code,
             latitude=str(round(math.fsum(p[0] for p in sorted(values)) / len(values), 6)),
             longitude=str(round(math.fsum(p[1] for p in sorted(values)) / len(values), 6)))
        for code, values in sorted(points.items())
    ]


if __name__ == '__main__':
    sample = ['PT', '1000-001', '', '', '', '', '', '', '', '38', '-9', '4']
    other = sample.copy()
    other[9] = '40'
    assert convert([sample, sample, other]) == [
        dict(zip='1000-001', latitude='39.0', longitude='-9.0')
    ]
    with open(sys.argv[1], encoding='utf-8') as source:
        result = convert(csv.reader(source, delimiter='\t'))
    assert result
    Path('geocode/PRT.json').write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
