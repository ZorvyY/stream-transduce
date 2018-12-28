// TESTS
const R = require('ramda');
const { xWrapStream, wrapStreamReducible } = require('ramda');


async function main() {

  const validNumber = R.both(R.pipe(R.trim, R.complement(R.equals(''))), R.complement(isNaN));
  const chunkify = R.pipe(R.toString, R.concat(R.__, '\n'));

  const ducer = R.compose(
    R.map(R.toString),
    R.map(Number),
    R.map(R.multiply(2)),
    R.map(x => Math.round(x*100)/100),
    R.map(chunkify),
  );

  const arr = [3,1,4,1,5,9,2,6,5];

  //const result = await R.transduce(ducer, streamAccum, process.stdout, wrapStreamReducible(process.stdin));
  const result = await R.transduce(ducer, (acc, x) => acc + x, 0, wrapStreamReducible(process.stdin));
  console.log(result);
  //const result = R.transduce(ducer, streamAccum, process.stdout, [3,1,4,1,5,9,2,6,5]);


  //const result = await R.into(xWrapStream(process.stdout), ducer, wrapStreamReducible(process.stdin));
  //const result = R.into(xWrapStream(process.stdout), ducer, [3,1,4,1,5,9,2,6,5]);


  /*

  const result = await R.into(xWrapStream(process.stdout), ducer, wrapStreamReducible(process.stdin));
  const result = await R.into(xWrapStream(process.stdout), ducer, wrapStreamReducible(process.stdin));
  const result = await R.into(xWrapStream(process.stdout), ducer, wrapStreamReducible(process.stdin));
  const result = R.into(xWrapStream(process.stdout), ducer, [3,1,4,1,5,9,2,6,5]);
  */

  // For if we actually want the accumulated value
  //console.log(result);
}

//main();
