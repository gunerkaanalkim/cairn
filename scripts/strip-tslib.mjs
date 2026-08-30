// ng-packagr always injects a tslib dependency even when importHelpers is off.
// The emitted bundles contain zero tslib references, so the entry is removed here.
// The explicit files list also forces npm to include core/package.json, which npm
// otherwise skips because that directory carries its own package.json.
import { readFileSync, writeFileSync } from 'node:fs';

const path = 'dist/cairn-datatable/package.json';
const pkg = JSON.parse(readFileSync(path, 'utf8'));
delete pkg.dependencies;
pkg.files = ['core', 'fesm2022', 'styles', 'types', 'LICENSE', 'README.md'];
writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
console.log('Patched', path);
