const { xWrapStream, wrapStreamReducible } = require('./index.js');
const R = require('ramda');

// Get a readable stream somehow
const stream = process.stdin;
const reducibleStream = wrapStreamReducible(stream);

// Convert to number, double, and round
const transducer = R.compose(
    R.map(R.toString),
    R.map(Number),
    R.map(R.multiply(2)), 
    R.map(x => Math.round(x*100)/100),
);

// Log the sum
R.transduce(transducer, (acc, x) => acc+x, 0, reducibleStream).then(console.log);

// Note when running: Use CTRL+D to emit an EOF character, signaling the end of stdin.
// The value will only be logged after the readable stream has ended.
