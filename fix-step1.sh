#!/bin/bash
set -e

# 1. Update tsconfig.json
sed -i '' 's/"cairn-datatable": \["\.\/dist\/cairn-datatable"\],/"@guneralkim\/cairn-datatable": \["\.\/dist\/cairn-datatable"\],/g' tsconfig.json
sed -i '' 's/"cairn-datatable\/\*": \["\.\/dist\/cairn-datatable\/\*"\]/"@guneralkim\/cairn-datatable\/\*": \["\.\/dist\/cairn-datatable\/\*"\]/g' tsconfig.json

# 2. Update package.json
sed -i '' 's/"url": "git+https:\/\/github.com\/gunerkaanalkim\/cairn.git"/"url": "git+https:\/\/github.com\/gunerkaanalkim\/cairn.git",\n    "directory": "projects\/cairn-datatable"/g' projects/cairn-datatable/package.json

# 3. Update ng-package.json
sed -i '' 's/"entryFile": "src\/public-api.ts"/"entryFile": "src\/public-api.ts"\n  },\n  "assets": \[\n    ".\/styles\/\*\*\/\*.css"\n  \]/g' projects/cairn-datatable/ng-package.json

# 4. Create core/ng-package.json if not exists
mkdir -p projects/cairn-datatable/core
echo '{
  "lib": {
    "entryFile": "src/public-api.ts"
  }
}' > projects/cairn-datatable/core/ng-package.json

# 5. Create LICENSE and README.md
echo "MIT License" > projects/cairn-datatable/LICENSE
echo "# Cairn DataTable" > projects/cairn-datatable/README.md

echo "Step 1 files updated."
