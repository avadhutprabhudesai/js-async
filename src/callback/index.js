/**
 * Callback
 * Nested callbacks
 * Callback hell
 */

export const callbacks = () => {
  const transformer = (val, cb) => {
    console.log('Value passed to transformer: ', val);
    return cb(val);
  };

  const twice = transformer(10, (val) => val * 2);
  const square = transformer(10, (val) => val * val);
  const filterEvens = transformer([1, 2, 3, 4], (arr) =>
    arr.filter((el) => el % 2 === 0)
  );

  console.log('value returned from transformer:', twice);
  console.log('value returned from transformer:', square);
  console.log('value returned from transformer:', filterEvens);

  /**
   * Get patty
   * Cook patty
   * Get bun
   * Put patty in the bun
   * Serve the burger
   */

  const delayedExecution = (fn) =>
    setTimeout(() => {
      fn();
    }, 1000);
  const step1 = (fn) => fn('r1');
  const step2 = (prev, fn) => delayedExecution(() => fn(prev + 'r2'));
  const step3 = (prev, fn) => delayedExecution(() => fn(prev + 'r3'));
  const step4 = (prev, fn) => delayedExecution(() => fn(prev + 'r4'));

  const results = (finalStep) =>
    step1(function (r1) {
      step2(r1, function (r2) {
        step3(r2, function (r3) {
          step4(r3, function (r4) {
            finalStep(r4);
          });
        });
      });
    });
  results((r) => console.log('Final result after step 4 is : ', r));
};
