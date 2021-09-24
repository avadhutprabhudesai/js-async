/* eslint-disable no-undef */
/**
 * Basic
 * . one path for rejection and runtime exception
 * . forgetting to return the promise in the promise chain
 *
 * Advanced
 * . Not using Promise.resolve() or Promise.reject()
 * . promises fall through if a function is not provided as a handler in .then()
 * .
 */

describe('One path for rejection and exceptions', () => {
  const fn = (num) => {
    return new Promise((resolve, reject) => {
      if (num % 2 === 0) {
        return someFunction();
      }
      reject('This promise was rejected');
    });
  };
  it('should call the catch block for the rejection', () => {
    return fn(1)
      .then(() => {})
      .catch((reason) => expect(reason).toEqual('This promise was rejected'));
  });
  it('should call the catchh block for the runtime exception', () => {
    return fn(2)
      .then(() => {})
      .catch((reason) => {
        expect(reason instanceof ReferenceError).toBeTruthy();
      });
  });
});

describe('forgetting to return the promise in the promise chain', () => {
  it('should pass undefined to the next successHandler if previous .then() misses to return', () => {
    return Promise.resolve(42)
      .then((val) => {
        expect(val).toEqual(42);
        return Promise.resolve(val + 10);
      })
      .then((val) => {
        expect(val).toEqual(52);
        Promise.resolve(val * 2);
      })
      .then((val) => {
        expect(val).toBeUndefined();
      });
  });
});

describe('Not using Promise.resolve() or Promise.reject', () => {
  it('is an example of using unnecessary promise constructor', () => {
    return new Promise((res) => {
      res(42);
    }).then((val) => expect(val).toEqual(42));
  });
  it('should use Promise.resolve() to resolve with synchronous values', () => {
    return Promise.resolve(42).then((val) => expect(val).toEqual(42));
  });
});

describe('Promise fallthrough', () => {
  it('is an example of promise fall through when successHandler is not a function', () => {
    return Promise.resolve(42)
      .then(44)
      .then((val) => {
        expect(val).toEqual(42);
      });
  });
});
