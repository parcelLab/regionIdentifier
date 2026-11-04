"""Build KOR points from a local GeoNames KR.zip: python3 scripts/generate-kor-geocode.py KR.zip."""
import json
import math
import re
import sys
import zipfile
from collections import defaultdict
from pathlib import Path


def representative(points):
    points = sorted(set(points))
    return tuple(round(math.fsum(p[i] for p in points) / len(points), 6) for i in (0, 1))


assert representative([(1, 2), (3, 4), (1, 2)]) == (2, 3)
assert representative([(3, 4), (1, 2)]) == (2, 3)

if __name__ == "__main__":
    groups = defaultdict(list)
    with zipfile.ZipFile(sys.argv[1]) as archive:
        for line in archive.read("KR.txt").decode("utf-8").splitlines():
            row = line.split("\t")
            assert len(row) == 12 and row[0] == "KR"
            assert re.fullmatch(r"[0-9]{5}", row[1])
            latitude, longitude = float(row[9]), float(row[10])
            assert math.isfinite(latitude) and -90 <= latitude <= 90
            assert math.isfinite(longitude) and -180 <= longitude <= 180
            groups[row[1]].append((latitude, longitude))
    assert groups
    data = []
    for code, points in sorted(groups.items()):
        latitude, longitude = representative(points)
        data.append({"zip": code, "latitude": str(latitude), "longitude": str(longitude)})
    target = Path(__file__).resolve().parents[1] / "geocode" / "KOR.json"
    target.write_text(json.dumps(data, indent=2) + "\n")
