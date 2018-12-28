## Functions

<dl>
<dt><a href="#xWrapStream">xWrapStream(stream, [fn])</a> ⇒ <code>Object</code></dt>
<dd><p>Wraps a writable stream in a transformer, making it suitable for use as
an accumulator value.</p>
</dd>
<dt><a href="#wrapStreamReducible">wrapStreamReducible(stream, [reducer])</a> ⇒ <code>*</code></dt>
<dd><p>This function adds a <code>reduce</code> method to stream method, returning a new
reducible stream to be used . The defaut reducer is <code>_reduceStream</code>.</p>
</dd>
</dl>

<a name="xWrapStream"></a>

## xWrapStream(stream, [fn]) ⇒ <code>Object</code>
Wraps a writable stream in a transformer, making it suitable for use as
an accumulator value.

**Kind**: global function  
**Returns**: <code>Object</code> - - The transformer, with the init, result, and step transducer functions as properties.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| stream | <code>stream.writeable</code> |  | The stream to be used as the accumulator. |
| [fn] | <code>function</code> | <code>_streamAccum</code> | The accumulator function. Defaults to `_streamAccum`. |

**Example**  
```js
// Get an writable stream somehow
const stream = process.stdout;
const transformer = xWrapStream(stream);

// Convert to number, double, and round, and make to string
const chunkify = R.pipe(R.toString, R.concat(R.__, '\n'));
const transducer = R.compose(
    R.map(R.toString),
    R.map(Number),
    R.map(R.multiply(2)), 
    R.map(x => Math.round(x*100)/100),
    R.map(chunkify),
);

// Print sum to stdout
R.into(transformer, transducer, [1,2,3,5,3,2]);
    
```
<a name="wrapStreamReducible"></a>

## wrapStreamReducible(stream, [reducer]) ⇒ <code>\*</code>
This function adds a `reduce` method to stream method, returning a new
reducible stream to be used . The defaut reducer is `_reduceStream`.

**Kind**: global function  
**Returns**: <code>\*</code> - The resulting value of the reduction.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| stream | <code>stream.Readable</code> |  | The stream to be wrapped. |
| [reducer] | <code>function</code> | <code>reduceStream</code> | The reducer. Defaults to the builtin `_reduceStream`. |

**Example**  
```js
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
    
```
