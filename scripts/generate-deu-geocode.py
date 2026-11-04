"""Build DEU representative points from the GeoNames DE.txt postal export."""

import json
import math
import re
import sys
from pathlib import Path


def generate(text):
    points = {}
    for line in text.splitlines():
        fields = line.split('\t')
        assert len(fields) == 12 and fields[0] == 'DE'
        code = fields[1]
        assert re.fullmatch(r'[0-9]{5}', code)
        latitude, longitude = map(float, fields[9:11])
        assert math.isfinite(latitude) and 47 <= latitude <= 56
        assert math.isfinite(longitude) and 5 <= longitude <= 16
        points.setdefault(code, set()).add((latitude, longitude))
    assert points
    result = []
    for code, locations in sorted(points.items()):
        locations = sorted(locations)
        latitude, longitude = (
            f'{math.fsum(point[index] for point in locations) / len(locations):.6f}'
            for index in (0, 1)
        )
        result.append({'zip': code, 'latitude': latitude, 'longitude': longitude})
    return result


if __name__ == '__main__':
    row = 'DE\t01001\tTest\tState\tST\t\t00\tDistrict\t0\t50\t10\t4'
    other = row.replace('\t50\t10\t', '\t52\t12\t')
    expected = [{'zip': '01001', 'latitude': '51.000000', 'longitude': '11.000000'}]
    assert generate('\n'.join([row, row, other])) == expected
    assert generate('\n'.join([other, row])) == expected
    for invalid in [row.replace('01001', '1001'), row.replace('\t50\t', '\tnan\t')]:
        try:
            generate(invalid)
        except AssertionError:
            pass
        else:
            raise AssertionError('Invalid source accepted')
    data = generate(Path(sys.argv[1]).read_text(encoding='utf-8'))
    Path(__file__).resolve().parents[1].joinpath('geocode/DEU.json').write_text(
        json.dumps(data, indent=2) + '\n', encoding='utf-8'
    )
    print(f'Generated {len(data)} unique DEU postal codes')
