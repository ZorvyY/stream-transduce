# Transducer wrapper for node streams

`stream-transduce` is a small utility library that allows node streams to be used with transducers as specified in libraries like [Transducers.js](https://github.com/jlongster/transducers.js), [Transducers-js](https://github.com/cognitect-labs/transducers-js) and [Ramda](https://github.com/ramda/ramda). This is designed specifically for use with Ramda.

## Installation

```bash
npm install stream-transduce
```

## Usage

```javascript
const { xWrapStream, wrapStreamReducible } = require('stream-transduce');
const R = require('ramda');

// Get a readable stream somehow
const reducibleStream = wrapStreamReducible(process.stdin);

// Convert to number, double, and round
const transducer = R.compose(
    R.map(R.toString),
    R.map(Number),
    R.map(R.multiply(2)), 
    R.map(x => Math.round(x*100)/100),
);

// Log the sum of the doubles of each number entered
// into the console
R.transduce(transducer, (acc, x) => acc+x, 0, reducibleStream).then(console.log);
```

## Motivation

Streams are an example of *data expressed over time* -- this makes it ideal target for use by transducers. Transducers can be used to compose logging functions, for instance, and if the data is too large, it becomes impossible to read it all into memory as would be required to reduce an array, object, or string.

## Dependence on Ramda

This was designed to be used with Ramda, and more specifically with the Ramda functions `into` and `transduce`. The resulting objects follow the transducer protocol. Some of the capabilities of this library are provided by other libraries such as `transducers-js`, but none provide a turnkey solution for Node streams in particular.

## API

The API can be found [here](./DOCS.md)