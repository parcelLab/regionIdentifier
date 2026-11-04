"""Generate CAN FSA points from an extracted GeoNames CA.txt file."""

import csv
import json
import math
from pathlib import Path
import re
import sys


def representative(points):
    unique = sorted(set(points))
    return tuple(sum(p[i] for p in unique) / len(unique) for i in (0, 1))


# Duplicate rows must not change the representative point.
assert representative([(44, -79), (46, -81), (44, -79)]) == (45, -80)
assert representative([(46, -81), (44, -79)]) == (45, -80)

groups = {}
excluded = []
with open(sys.argv[1], encoding="utf-8") as source:
    rows = list(csv.reader(source, delimiter="\t"))
for row in rows:
    assert len(row) == 12 and row[0] == "CA", row
    code = row[1]
    if code in {"H0H", "T3T 0E5", "V3Y 0H2"}:
        excluded.append(code)
        continue
    assert re.fullmatch(r"[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]", code), code
    point = (float(row[9]), float(row[10]))
    assert all(math.isfinite(value) for value in point), row
    assert -90 <= point[0] <= 90 and -180 <= point[1] <= 180, row
    groups.setdefault(code, []).append(point)

assert len(rows) == 1657 and len(groups) == 1650
assert sorted(excluded) == ["H0H", "T3T 0E5", "V3Y 0H2"]
result = []
for code, points in sorted(groups.items()):
    latitude, longitude = representative(points)
    result.append({"zip": code, "latitude": str(round(latitude, 6)),
                   "longitude": str(round(longitude, 6))})
assert len({entry["zip"] for entry in result}) == len(result)
Path(__file__).resolve().parents[1].joinpath("geocode/CAN.json").write_text(
    json.dumps(result, indent=2) + "\n", encoding="utf-8"
)
