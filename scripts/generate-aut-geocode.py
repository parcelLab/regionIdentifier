"""Convert a GeoNames AT.txt export to one representative point per postal code."""
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
        assert len(row) == 12 and row[0] == 'AT'
        code = row[1]
        assert re.fullmatch(r'[0-9]{4}', code)
        latitude, longitude = map(float, row[9:11])
        assert math.isfinite(latitude) and -90 <= latitude <= 90
        assert math.isfinite(longitude) and -180 <= longitude <= 180
        points[code].add((latitude, longitude))
    assert points
    return [
        dict(zip=code,
             latitude=f'{math.fsum(p[0] for p in sorted(values)) / len(values):.4f}',
             longitude=f'{math.fsum(p[1] for p in sorted(values)) / len(values):.4f}')
        for code, values in sorted(points.items())
    ]


if __name__ == '__main__':
    row = ['AT', '0123', '', '', '', '', '', '', '', '47', '12', '']
    other = row.copy()
    other[9:11] = ['49', '14']
    assert convert([row, row, other]) == [
        dict(zip='0123', latitude='48.0000', longitude='13.0000')
    ]
    with open(sys.argv[1], encoding='utf-8') as source:
        result = convert(csv.reader(source, delimiter='\t'))
    Path(sys.argv[2]).write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
