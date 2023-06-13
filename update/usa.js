const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

execSync('wget -P update https://download.geonames.org/export/zip/US.zip')
execSync('unzip update/US.zip -d update')

const data = fs.readFileSync(path.join(__dirname, 'US.txt'), 'utf8')

const agg = {}
for (const line of data.split('\n')) {
  const [, zip, , , state] = line.split('\t')
  if (state) {
    const region = `US-${state}`
    if (!agg[region]) {
      agg[region] = [parseInt(zip, 10)]
    } else {
      agg[region].push(parseInt(zip, 10))
    }
  }
}

const result = []
for (const region in agg) {
  result.push({
    region,
    list: agg[region]
  })
}

fs.writeFileSync(path.join(__dirname, '..', 'regions', 'USA.json'), JSON.stringify(result))
fs.unlinkSync(path.join(__dirname, 'US.txt'))
fs.unlinkSync(path.join(__dirname, 'US.zip'))