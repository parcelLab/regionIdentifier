"""Generate BEL data from the GeoNames BE.txt file supplied as the first argument."""

import json
import math
import re
import sys
from pathlib import Path


def representative(points):
    points = sorted(set(points))
    return tuple(round(sum(p[i] for p in points) / len(points), 6) for i in (0, 1))


assert representative([(50, 4), (52, 6), (50, 4)]) == (51, 5)
assert representative([(52, 6), (50, 4)]) == (51, 5)

if __name__ == "__main__":
    groups = {}
    for line in Path(sys.argv[1]).read_text(encoding="utf-8").splitlines():
        row = line.split("\t")
        assert len(row) == 12 and row[0] == "BE" and re.fullmatch(r"\d{4}", row[1])
        lat, lon = float(row[9]), float(row[10])
        assert math.isfinite(lat) and math.isfinite(lon)
        assert -90 <= lat <= 90 and -180 <= lon <= 180
        groups.setdefault(row[1], set()).add((lat, lon))
    assert groups
    result = []
    for code, points in sorted(groups.items()):
        lat, lon = representative(points)
        result.append({"zip": code, "latitude": str(lat), "longitude": str(lon)})
    Path(__file__).resolve().parents[1].joinpath("geocode/BEL.json").write_text(
        json.dumps(result, indent=2) + "\n", encoding="utf-8"
    )
