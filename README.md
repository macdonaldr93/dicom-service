# DICOM service

[![test | dicom-service](https://github.com/macdonaldr93/dicom-service/actions/workflows/test-dicom-service.yml/badge.svg?branch=main)](https://github.com/macdonaldr93/dicom-service/actions/workflows/test-dicom-service.yml)

DICOM service for handling DICOM uploads, extracting tags, and viewing DICOM as images.

## Commands

| Command      | Description                                                              |
| ------------ | ------------------------------------------------------------------------ |
| dev          | Starts a dev server with hot reloading                                   |
| docker-build | Builds docker container                                                  |
| docker:dev   | Starts a server using [Docker Compose](https://docs.docker.com/compose/) |
| lint         | Lints all source code                                                    |
| start        | Starts a server for production                                           |
| test         | Runs tests for source code                                               |
| test:watch   | Runs tests for source code and watches for changes                       |

## How to use this repo

### Requirements

- Node.js v20.11.1

### Setup

First, install dependencies.

```bash
npm install
```

Next, let's run the test suite to make sure the codebase is ready to run.

```bash
npm test
```

Assuming the tests pass, you can start the development server.

```bash
npm run dev
```

### Running tests

You can run the test suite with

```bash
npm test
```

During development, it's best to run the test suite in watch mode.

```bash
npm run test:watch
```

## Technical details

- [System design](./docs/SYSTEM-DESIGN.md)
