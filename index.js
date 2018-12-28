// suite for generating transformers & reducibles
function _streamAccum(a, c) {
  a.write(c);
  return a;
}

/**
 * Wraps a writable stream in a transformer, making it suitable for use as
 * an accumulator value.
 * @param {stream.writeable} stream - The stream to be used as the accumulator.
 * @param {function} [fn=_streamAccum] - The accumulator function. Defaults to `_streamAccum`. 
 * @return {{x: fn}} - The transformer, with the init, result, and step transducer functions as properties.
 * @example
 * 
 * // Get an writable stream somehow
 * const stream = process.stdout;
 * const transformer = xWrapStream(stream);
 *
 * // Convert to number, double, and round, and make to string
 * const chunkify = R.pipe(R.toString, R.concat(R.__, '\n'));
 * const transducer = R.compose(
 *     R.map(R.toString),
 *     R.map(Number),
 *     R.map(R.multiply(2)), 
 *     R.map(x => Math.round(x*100)/100),
 *     R.map(chunkify),
 * );
 *
 * // Print sum to stdout
 * R.into(transformer, transducer, [1,2,3,5,3,2]);
 *     
 */
function xWrapStream(stream, fn=_streamAccum) {
  return {
    ['@@transducer/init']: function() { return writeStream; },
    ['@@transducer/result']: function(stream) { return stream; },
    ['@@transducer/step']: fn,
  };
}



function _reduceStream(fn, acc) {
  this.on('data', chunk => {
    acc = fn(acc, chunk);
  });
  return new Promise((resolve, reject) => {
    this.on('end', () => resolve(acc));
    this.on('error', err => reject({err, acc}));
  });
}

/**
 * This function adds a `reduce` method to stream method, returning a new
 * reducible stream to be used . The defaut reducer is `_reduceStream`. 
 * @param {stream.Readable} stream - The stream to be wrapped.
 * @param {function} [reducer=reduceStream] - The reducer. Defaults to the builtin `_reduceStream`. 
 * @return {*} The resulting value of the reduction.
 * @example
 * 
 * // Get a readable stream somehow
 * const stream = process.stdin;
 * const reducibleStream = wrapStreamReducible(stream);
 *
 * // Convert to number, double, and round
 * const transducer = R.compose(
 *     R.map(R.toString),
 *     R.map(Number),
 *     R.map(R.multiply(2)), 
 *     R.map(x => Math.round(x*100)/100),
 * );
 *
 * // Log the sum
 * R.transduce(transducer, (acc, x) => acc+x, 0, reducibleStream).then(console.log);
 *     
 */
function wrapStreamReducible(stream, reducer=_reduceStream) {
  stream['reduce'] = reducer;
  return stream;
}

module.exports = {
  xWrapStream,
  wrapStreamReducible,
};

