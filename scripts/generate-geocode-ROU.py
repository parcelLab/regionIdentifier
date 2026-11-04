"""Convert the GeoNames RO.txt postal extract to the ROU lookup (see docs)."""
import collections
import json
import math
from pathlib import Path
import re
import sys

points = collections.defaultdict(set)
for line in Path(sys.argv[1]).read_text(encoding="utf-8").splitlines():
    row = line.split("\t")
    assert len(row) == 12 and row[0] == "RO", row
    code = row[1]
    assert re.fullmatch(r"\d{6}", code), code
    latitude, longitude = float(row[9]), float(row[10])
    assert math.isfinite(latitude) and -90 <= latitude <= 90, row
    assert math.isfinite(longitude) and -180 <= longitude <= 180, row
    points[code].add((latitude, longitude))

result = []
for code, locations in sorted(points.items()):
    locations = sorted(locations)
    latitude, longitude = (
        str(round(sum(point[axis] for point in locations) / len(locations), 6))
        for axis in (0, 1)
    )
    result.append({"zip": code, "latitude": latitude, "longitude": longitude})

assert len(result) == 37914
assert next(row for row in result if row["zip"] == "510002") == {
    "zip": "510002", "latitude": "46.08405", "longitude": "23.5695"
}
Path("geocode/ROU.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
