const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const result = [];

const codes = ['US', 'AS', 'FM', 'GU', 'MH', 'MP', 'PR', 'VI'];

for (const code of codes) {
  execSync(`wget -P update https://download.geonames.org/export/zip/${code}.zip`);
  execSync(`unzip -o update/${code}.zip -d update`);

  const data = fs.readFileSync(path.join(__dirname, `${code}.txt`), 'utf8');

  const agg = {};
  for (const line of data.split('\n')) {
    const [rawCountry, zip, , , rawState] = line.split('\t'); // eslint-disable-line unicorn/no-unreadable-array-destructuring
    const state = rawCountry === 'US' ? rawState : rawCountry;
    if (state) {
      const region = `US-${state}`;
      if (agg[region]) {
        agg[region].push(parseInt(zip, 10));
      } else {
        agg[region] = [parseInt(zip, 10)];
      }
    }
  }

  for (const region in agg) {
    result.push({
      region,
      list: agg[region],
    });
  }

  fs.unlinkSync(path.join(__dirname, `${code}.txt`));
  fs.unlinkSync(path.join(__dirname, `${code}.zip`));
}

fs.writeFileSync(path.join(__dirname, '..', 'regions', 'USA.json'), JSON.stringify(result, null, 2));
