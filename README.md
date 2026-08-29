# Cairn

Cairn is a collection of modern, signal-based Angular components and utilities. It focuses on zero-dependency, headless-capable designs that seamlessly integrate with the latest Angular features.

## Live Demo

A live demo of the packages is available at: [https://gunerkaanalkim.github.io/cairn/](https://gunerkaanalkim.github.io/cairn/)

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
- `projects/cairn-demo`: An Angular application demonstrating how to use the library.

## Contributing and License

Please read our [Contributing Guide](CONTRIBUTING.md) if you want to contribute.

This repository is licensed under the MIT License.
