"""Build GBR district representative points from GeoNames GB.txt (CC BY 4.0)."""

import json
import math
import re
import sys
from pathlib import Path


def build(text):
    districts = {}
    for line in text.splitlines():
        fields = line.split("\t")
        assert len(fields) == 12 and fields[0] == "GB", "Expected GeoNames GB rows"
        zip_code = fields[1]
        assert re.fullmatch(r"[A-Z]{1,2}\d[A-Z\d]?", zip_code), zip_code
        latitude, longitude = map(float, fields[9:11])
        assert math.isfinite(latitude) and -90 <= latitude <= 90
        assert math.isfinite(longitude) and -180 <= longitude <= 180
        districts.setdefault(zip_code, set()).add((latitude, longitude))
    assert districts, "Empty input"
    result = []
    for zip_code, points in sorted(districts.items()):
        points = sorted(points)
        result.append({
            "zip": zip_code,
            "latitude": f"{math.fsum(p[0] for p in points) / len(points):.4f}",
            "longitude": f"{math.fsum(p[1] for p in points) / len(points):.4f}",
        })
    return result


if __name__ == "__main__":
    row = "GB\tAB1\tPlace\t\t\t\t\t\t\t57\t-2\t4"
    other = row.replace("57\t-2", "59\t-4")
    assert build(row + "\n" + row + "\n" + other) == [
        {"zip": "AB1", "latitude": "58.0000", "longitude": "-3.0000"}
    ]
    assert build(other + "\n" + row) == build(row + "\n" + other)
    for bad in [row.replace("57\t-2", "nan\t-2"), row.replace("57\t-2", "91\t-2"), ""]:
        try:
            build(bad)
        except AssertionError:
            pass
        else:
            raise AssertionError("Invalid input was accepted")
    output = Path(__file__).resolve().parents[1] / "geocode" / "GBR.json"
    output.write_text(json.dumps(build(Path(sys.argv[1]).read_text()), indent=2) + "\n")
