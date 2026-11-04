"""Generate HUN geocodes from the GeoNames HU.txt postal export."""

import json
import math
import re
import sys
from collections import defaultdict
from pathlib import Path


def representative(points):
    unique = sorted(set(points))
    return tuple(f"{sum(p[i] for p in unique) / len(unique):.4f}" for i in (0, 1))


assert representative([(46, 16), (48, 18), (46, 16)]) == ("47.0000", "17.0000")
assert representative([(46, 16)]) == ("46.0000", "16.0000")

if __name__ == "__main__":
    grouped = defaultdict(list)
    rows = Path(sys.argv[1]).read_text(encoding="utf-8").splitlines()
    for row in rows:
        fields = row.split("\t")
        assert len(fields) == 12 and fields[0] == "HU", row
        code = fields[1]
        assert re.fullmatch(r"[1-9][0-9]{3}", code), code
        latitude, longitude = map(float, fields[9:11])
        assert math.isfinite(latitude) and 45 <= latitude <= 49, row
        assert math.isfinite(longitude) and 16 <= longitude <= 23, row
        grouped[code].append((latitude, longitude))
    assert grouped
    result = []
    for code, points in sorted(grouped.items()):
        latitude, longitude = representative(points)
        result.append({"zip": code, "latitude": latitude, "longitude": longitude})
    Path(sys.argv[2]).write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(f"{len(rows)} source rows; {len(result)} unique postal codes")
