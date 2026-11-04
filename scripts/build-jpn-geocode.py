"""Build JPN geocodes from an extracted GeoNames JP.txt (see docs/geocode-JPN.md)."""

import json
import math
from pathlib import Path
import re
import sys


def representative(points):
    points = sorted(set(points))
    return tuple(round(sum(p[i] for p in points) / len(points), 4) for i in (0, 1))


assert representative([(1, 2), (3, 4), (3, 4)]) == (2, 3)
assert representative([(3, 4), (1, 2)]) == (2, 3)

codes = {}
for line in Path(sys.argv[1]).read_text(encoding="utf-8").splitlines():
    fields = line.split("\t")
    assert len(fields) == 12 and fields[0] == "JP"
    assert re.fullmatch(r"\d{3}-\d{4}", fields[1])
    latitude, longitude = map(float, fields[9:11])
    assert math.isfinite(latitude) and -90 <= latitude <= 90
    assert math.isfinite(longitude) and -180 <= longitude <= 180
    codes.setdefault(fields[1].replace("-", ""), set()).add((latitude, longitude))

result = []
for code, points in sorted(codes.items()):
    latitude, longitude = representative(points)
    result.append({"zip": code, "latitude": str(latitude), "longitude": str(longitude)})
assert result and len(result) == len({row["zip"] for row in result})
Path(__file__).resolve().parents[1].joinpath("geocode/JPN.json").write_text(
    json.dumps(result, indent=2) + "\n", encoding="utf-8"
)
