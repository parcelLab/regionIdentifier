const { execFileSync } = require('node:child_process');
const path = require('node:path');
const { geoNamesEntries, groupPoints, meanRows, parseTsv, writeRows } = require('./geocode-source');

const archive = path.resolve(process.argv[2]);
// shortcut: KR.txt can be up to 16 MiB. Stream the archive if a later export exceeds this limit.
const source = execFileSync('unzip', ['-p', archive, 'KR.txt'], { maxBuffer: 16 * 1024 * 1024 });
const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(source);
const rows = parseTsv(text);
const entries = geoNamesEntries(rows, 'KR', /^\d{5}$/);
const groups = groupPoints(entries);
const result = meanRows(groups, 6, { fixed: false });
writeRows(result, 'KOR');
