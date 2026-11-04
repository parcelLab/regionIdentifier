"""Generate FRA points from La Poste's coordinate CSV; see docs/geocode-FRA.md."""

import csv
import json
import math
import re
import sys
from pathlib import Path


def generate(rows):
    groups = {}
    missing = set()
    for row in rows:
        commune = row['code_commune_insee']
        # Keep metropolitan France and the five overseas departments, not COM/Monaco.
        if commune.startswith(('97', '98', '99')) and not commune.startswith(
            ('971', '972', '973', '974', '976')
        ):
            continue
        zip_code = row['code_postal']
        assert re.fullmatch(r'\d{5}', zip_code), zip_code
        if not row['latitude'] or not row['longitude']:
            missing.add(zip_code)
            continue
        point = (float(row['latitude']), float(row['longitude']))
        assert all(math.isfinite(value) for value in point)
        assert -90 <= point[0] <= 90 and -180 <= point[1] <= 180
        communes = groups.setdefault(zip_code, {})
        assert commune not in communes or communes[commune] == point
        communes[commune] = point
    result = []
    for zip_code, communes in sorted(groups.items()):
        points = list(communes.values())
        result.append({
            'zip': zip_code,
            'latitude': f'{sum(p[0] for p in points) / len(points):.6f}',
            'longitude': f'{sum(p[1] for p in points) / len(points):.6f}',
        })
    return result, sorted(missing - groups.keys())


if __name__ == '__main__':
    sample = {'code_commune_insee': '01001', 'code_postal': '01400',
              'latitude': '46', 'longitude': '4'}
    other = dict(sample, code_commune_insee='01002', latitude='48', longitude='6')
    assert generate([sample, sample, other])[0] == [
        {'zip': '01400', 'latitude': '47.000000', 'longitude': '5.000000'}
    ]
    with open(sys.argv[1], encoding='utf-8', newline='') as source:
        data, missing_codes = generate(csv.DictReader(source))
    assert data
    Path(__file__).resolve().parents[1].joinpath('geocode/FRA.json').write_text(
        json.dumps(data, indent=2) + '\n', encoding='utf-8'
    )
    print(f'{len(data)} unique postal codes; no coordinates: {missing_codes}')
