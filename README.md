# Observe
[![Build Status](https://travis-ci.org/jmars/drum.svg?branch=master)](https://travis-ci.org/jmars/observe)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

> A Partial Object.observe Polyfill.

Observe is a very minimal and incomplete (intentionally) Object.observe polyfill, it does not detect any new keys after observation. If all you want is
to see when a key has been changed and when it was deleted, this does it. It uses native Object.observe if it is available

## Building
> npm run build

## Run tests
> npm test

```
Observe
  ✓ should notify of any property changes

1 passing (13ms)
```