"""Generate NLD prefix points from an extracted GeoNames NL.txt file."""
import collections
import json
import math
import pathlib
import re
import sys

points = collections.defaultdict(set)
for line in pathlib.Path(sys.argv[1]).read_text().splitlines():
    fields = line.split('\t')
    assert len(fields) == 12 and fields[0] == 'NL'
    zip_code = fields[1]
    assert re.fullmatch(r'[0-9]{4}', zip_code)
    latitude, longitude = map(float, fields[9:11])
    assert math.isfinite(latitude) and -90 <= latitude <= 90
    assert math.isfinite(longitude) and -180 <= longitude <= 180
    points[zip_code].add((latitude, longitude))

assert points
result = []
for zip_code, locations in sorted(points.items()):
    locations = sorted(locations)
    latitude, longitude = (
        f'{sum(point[axis] for point in locations) / len(locations):.6f}'
        for axis in (0, 1)
    )
    result.append(dict(zip=zip_code, latitude=latitude, longitude=longitude))

assert len(result) == len({entry['zip'] for entry in result})
pathlib.Path(__file__).resolve().parents[1].joinpath('geocode/NLD.json').write_text(
    json.dumps(result, indent=2) + '\n'
)
