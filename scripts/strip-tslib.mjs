// ng-packagr always injects a tslib dependency even when importHelpers is off.
// The emitted bundles contain zero tslib references, so the entry is removed here.
// The explicit files list forces npm to include core/package.json, which npm
// otherwise skips because that directory carries its own package.json.
// The styles subpath must be declared in exports, otherwise the documented
// stylesheet import is blocked by Node's exports resolution.
import { readFileSync, writeFileSync } from 'node:fs';

const path = 'dist/cairn-datatable/package.json';
const pkg = JSON.parse(readFileSync(path, 'utf8'));

delete pkg.dependencies;
pkg.files = ['core', 'fesm2022', 'styles', 'types', 'LICENSE', 'README.md'];
pkg.exports = { ...pkg.exports, './styles/*': { default: './styles/*' } };

writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
console.log('Patched', path);
