// ng-packagr always injects a tslib dependency even when importHelpers is off.
// The emitted bundles contain zero tslib references, so the entry is removed here.
import { readFileSync, writeFileSync } from 'node:fs';

const path = 'dist/cairn-datatable/package.json';
const pkg = JSON.parse(readFileSync(path, 'utf8'));
delete pkg.dependencies;
writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
console.log('Removed dependencies field from', path);
