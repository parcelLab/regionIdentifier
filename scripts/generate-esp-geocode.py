"""Generate ESP representative points from an extracted GeoNames ES.txt file."""
import json
import re
import sys
from collections import defaultdict
from pathlib import Path


def aggregate(text):
    points = defaultdict(set)
    for line in text.splitlines():
        fields = line.split('\t')
        assert len(fields) == 12 and fields[0] == 'ES'
        code = fields[1]
        assert re.fullmatch(r'\d{5}', code)
        latitude, longitude = float(fields[9]), float(fields[10])
        assert -90 <= latitude <= 90 and -180 <= longitude <= 180
        points[code].add((latitude, longitude))
    assert points
    return [
        {
            'zip': code,
            'latitude': f'{sum(p[0] for p in sorted(values)) / len(values):.4f}',
            'longitude': f'{sum(p[1] for p in sorted(values)) / len(values):.4f}',
        }
        for code, values in sorted(points.items())
    ]


if __name__ == '__main__':
    # Duplicate rows must not change the representative point.
    sample = 'ES\t01200\tPlace\t\t\t\t\t\t\t42\t-2\t4\n'
    other = sample.replace('42\t-2', '44\t-4')
    assert aggregate(sample + sample + other) == [
        {'zip': '01200', 'latitude': '43.0000', 'longitude': '-3.0000'}
    ]
    result = aggregate(Path(sys.argv[1]).read_text(encoding='utf-8'))
    Path(__file__).resolve().parents[1].joinpath('geocode/ESP.json').write_text(
        json.dumps(result, indent=2) + '\n', encoding='utf-8'
    )
