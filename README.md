<img src="assets/logo/cairn-wordmark-auto.svg" alt="Cairn" width="150" />

Cairn is a collection of modern, signal-based Angular components and utilities. It focuses on zero-dependency, headless-capable designs that seamlessly integrate with the latest Angular features.

## Documentation and live demo

The documentation site carries a live, editable example for every feature next to the code that produces it: [https://gunerkaanalkim.github.io/cairn/](https://gunerkaanalkim.github.io/cairn/)

The same pages are available as Markdown in [`docs/`](./docs), starting from [the documentation index](./docs/README.md).

## Packages

- [**@gunerkaanalkim/cairn-datatable**](./projects/cairn-datatable): A signal-based, zoneless datatable for Angular 21+. ([npm](https://www.npmjs.com/package/@gunerkaanalkim/cairn-datatable))

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/gunerkaanalkim/cairn.git
   ```
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Build the library:
   ```bash
   npm run build:lib
   ```
4. Serve the demo application:
   ```bash
   npx ng serve cairn-demo
   ```

**Note:** The demo application relies on the compiled library in the `dist` folder via path mapping. You must run `npm run build:lib` before serving the demo, otherwise it will fail to compile.

## Commands

- `npm run build:lib`: Builds the `cairn-datatable` library into the `dist` folder.
- `npm run test:lib`: Runs unit tests for the library.
- `npm run verify`: Runs a full verification pipeline (builds the library, runs tests, and builds the demo).

## Repository Structure

- `projects/cairn-datatable`: The source code for the `@gunerkaanalkim/cairn-datatable` library.
- `projects/cairn-demo`: The documentation site, one route per feature, each with a live example.
- `docs`: The same documentation in Markdown.

## Contributing and License

Please read our [Contributing Guide](CONTRIBUTING.md) if you want to contribute.

This repository is licensed under the MIT License.
