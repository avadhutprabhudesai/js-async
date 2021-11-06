/* eslint-disable no-unused-vars */
/**
 * Async function
 *    Return value
 *      value
 *      resolved promise
 *      rejected promise
 *      Error
 *
 * await
 *    return value
 *      if promise is resolved
 *      if promise is rejected
 *
 *
 * Error handling with async await
 *    try-catch in function definition
 *    .catch() in function definition
 *    catch() at function call
 *    HOF for error handling
 *
 * Handling multiple async tasks
 *    serial execution, serial result
 *    serial execution, parallel result (NOT POSSIBLE TO IMPLEMENT)
 *    parallel execution, serial result
 *    parallel execution, parallel result (NOT POSSIBLE TO VERIFY)
 *
 * await in a loop
 *    for loop
 *    for-of loop
 *    forEach loop
 *    map
 *    filter
 *    reduce
 *
 */

import { checkAsyncReturn, fetchData, getFruitNums } from '.';

describe('Testing async funtion -> return value', () => {
  it('should return a resolved promise with undefined if async function does not return anything', () => {
    return expect(checkAsyncReturn()).resolves.toBeUndefined();
  });
  it('should return a resolved promise with a value x, when async function returns x', () => {
    return expect(checkAsyncReturn(2)).resolves.toEqual(2);
  });
  it('should return a resolved promise with a value x, when async function returns Promise.resolve(x)', () => {
    return expect(checkAsyncReturn(Promise.resolve(42))).resolves.toEqual(42);
  });
  it('should return a rejected promise with reason x, when async function returns Promise.reject(x)', () => {
    return expect(checkAsyncReturn(Promise.reject('Rejected'))).rejects.toEqual(
      'Rejected'
    );
  });
});

describe('Testing await keyword -> return values', () => {
  it('should return a value of a resolved promise', async () => {
    var pendingProm = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(42);
      }, 100);
    });
    var resolvedProm = await Promise.resolve(42);
    expect(pendingProm).toBe(42);
    expect(resolvedProm).toBe(42);
  });
  it('should return undefined when expression is a rejected promise', async () => {
    var result = await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Rejected');
      }, 100);
    }).catch((error) => {
      expect(error).toBe('Rejected');
    });
    expect(result).toBeUndefined();
  });
  it('should throw an error with the reason of rejected promise', async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Rejected');
      }, 100);
    }).catch((error) => {
      expect(error).toBe('Rejected');
    });
  });
});

describe('Error handling for async await', () => {
  it('Wrapping suspicios code in try catch', async () => {
    const fetchUser = async () => {
      try {
        const user = await Promise.reject('Connection error');
      } catch (error) {
        expect(error).toBe('Connection error');
      }
    };
    fetchUser();
  });
  it('Attaching .catch() to individual await expressions', () => {
    const fetchUser = async () => {
      const user = await Promise.reject('Connection error').catch((error) => {
        expect(error).toBe('Connection error');
      });
    };
    fetchUser();
  });
  it('Attaching .catch() to entire function call', () => {
    const fetchUser = async () => {
      const user = await Promise.reject('Connection error');
    };
    fetchUser().catch((error) => {
      expect(error).toBe('Connection error');
    });
  });
  it('Creating HOF to attache .catch() to passed-in async functions', () => {
    const safeAsync =
      (asyncFn, errorHandler) =>
      (...args) =>
        asyncFn(...args).catch(errorHandler);

    const fetchUser = async () => {
      await Promise.reject('Connection error');
    };
    const errorHandler = (error) => {
      expect(error).toBe('Connection error');
    };

    const safeFetchUser = safeAsync(fetchUser, errorHandler);
    safeFetchUser();
  });
});

describe('Testing multiple async tasks use cases', () => {
  it('serial execution, serial result', async () => {
    const result = [];
    const t1 = await fetchData('task1');
    result.push(t1);
    const t2 = await fetchData('task2');
    result.push(t2);
    const t3 = await fetchData('task3');
    result.push(t3);

    expect(result).toEqual(['task1', 'task2', 'task3']);
  });
  it('parallel execution, serial result', async () => {
    const result = [];
    const t1 = fetchData('task1');
    const t2 = fetchData('task2');
    const t3 = fetchData('task3');
    result.push(await t1);
    result.push(await t2);
    result.push(await t3);
    expect(result).toEqual(['task1', 'task2', 'task3']);
  });

  it('parallel execution, parallel result (unable to verify)', () => {
    var result = [];
    fetchData('task1').then((val) => result.push(val));
    fetchData('task2').then((val) => result.push(val));
    fetchData('task3').then((val) => result.push(val));
  });
});

const fruits = ['banana', 'orange', 'apple'];
describe('Testing await in a classic for loop', () => {
  it('should halt the execution with every occurence of await in each iteration of the loop', async () => {
    let result = [];
    for (let i = 0; i < fruits.length; i++) {
      const qty = await getFruitNums(fruits[i]);
      result.push(qty);
    }
    expect(result).toEqual([10, 20, 50]);
  });
});

describe('Testing await in forEach loop', () => {
  it('await should not work with forEach loop', async () => {
    let result = [];
    fruits.forEach(async (fruit) => {
      const qty = await getFruitNums(fruit);
      result.push(qty);
    });
    expect(result).not.toEqual([10, 20, 50]);
    expect(result).toEqual([]);
  });
});

describe('Testing await in Array.prototype.map', () => {
  it('should return the array of promises', () => {
    const results = fruits.map(async (fruit) => {
      const qty = await getFruitNums(fruit);
      return qty;
    });
    return Promise.all(results).then(([banana, orange, apple]) => {
      expect(banana).toEqual(10);
      expect(orange).toEqual(20);
      expect(apple).toEqual(50);
    });
  });
});
