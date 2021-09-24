import {
  checkLatency,
  findActivePhoneNumbers,
  findTheWinner,
  verifySecurityQuestions,
} from '.';

describe('Testing Promise.all()', () => {
  // return value is a promise
  it('should return a pending promise', () => {
    expect(
      Promise.all([Promise.resolve(42), Promise.resolve(55)]) instanceof Promise
    ).toBeTruthy();
  });

  // returned promise should resolve to an array
  it('returned promise should resolve to an array', () => {
    return Promise.all([Promise.resolve(42), Promise.resolve(55)]).then(
      (data) => {
        expect(Array.isArray(data)).toBeTruthy();
      }
    );
  });

  // iterable empty
  it('should synchronously return an already resolved promise if input array is empty', () => {
    var all = Promise.all([]);
    expect(all).toMatchObject({});
    return all.then((data) => expect(data).toEqual([]));
  });

  // iterable has only non promises
  it('should asynchronously return an already resolved promise if iterable contains no promises', () => {
    return Promise.all([1, 2, 3]).then((data) =>
      expect(data).toEqual([1, 2, 3])
    );
  });

  // iterable has promises which will resolve
  it('should asynchronously return an already resolved promise with resolved values of all input promises', () => {
    return Promise.all([
      Promise.resolve(42),
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(1000);
        }, 1000);
      }),
    ]).then((data) => expect(data).toEqual([42, 1000]));
  });

  // iterable has one promise that will reject
  it('should reject immediately if 1 promise is rejected', () => {
    return Promise.all([
      Promise.resolve(42),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject('Some error');
        }, 1000);
      }),
    ]).catch((error) => expect(error).toEqual('Some error'));
  });
});

describe('Testing Promise.allSettled()', () => {
  // return value
  it('should return a pending promise', () => {
    var allSettled = Promise.allSettled([
      Promise.resolve(42),
      Promise.reject(43),
    ]);
    expect(allSettled instanceof Promise).toBeTruthy();
  });
  // iterable is empty
  it('should return synchronously resolved promise object which has value as empty array when iterable is empty', () => {
    var allSettled = Promise.allSettled([]);
    expect(allSettled).toMatchObject({});
    return allSettled.then((data) => expect(data).toEqual([]));
  });
  // iterable has non promises
  it('should return asynchronously resolved promise with an array of input values when itrable contains only non-promises', () => {
    return Promise.allSettled([1, 2, 3, 4]).then((data) =>
      expect(data).toEqual([
        {
          status: 'fulfilled',
          value: 1,
        },
        {
          status: 'fulfilled',
          value: 2,
        },
        {
          status: 'fulfilled',
          value: 3,
        },
        {
          status: 'fulfilled',
          value: 4,
        },
      ])
    );
  });
  // iterable has all resolvable promises
  it('should return asynchronously resolved promises with an array of resolve/reject values of each input promises when iterable contains all resolvable promises', () => {
    return Promise.allSettled([
      Promise.resolve(55),
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(500);
        }, 1000);
      }),
      Promise.resolve(200),
    ]).then((data) =>
      expect(data).toEqual([
        {
          status: 'fulfilled',
          value: 55,
        },
        {
          status: 'fulfilled',
          value: 500,
        },
        {
          status: 'fulfilled',
          value: 200,
        },
      ])
    );
  });
  // iterable has one promise that will reject
  it('should return an asynchronously resolved promise with an array of resolve/reject value of each input promise when iterable contains one rejectable promise', () => {
    return Promise.allSettled([
      Promise.resolve(55),
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(500);
        }, 1000);
      }),
      Promise.reject(200),
    ]).then((data) =>
      expect(data).toEqual([
        {
          status: 'fulfilled',
          value: 55,
        },
        {
          status: 'fulfilled',
          value: 500,
        },
        {
          status: 'rejected',
          reason: 200,
        },
      ])
    );
  });
});

// @TODO: Promise.any() is failing is in Jest test runner. Debug the issue
// describe('Testing Promise.any()', () => {
//   // return value
//   it('should return a pending promise', () => {
//     //   var any = Promise.any([Promise.resolve(33)]);
//     //   expect(any instanceof Promise).toBeTruthy();
//   });
//   // iterable is empty
//   it('should reject with an Aggregate error when iterable is empty', () => {
//     // expect(Promise.any([]) instanceof AggregateError).toBeTruthy();
//   });
//   // iterable contains all non promises
//   it('should resolve with the first value in the iterable when iterable contains all non-promies', () => {}); // iterable contains all non promises
//   // iterable contains all resolvable promise
//   it('should resolve with the value of first promise that fulfills when iterable contains all resolvable promises', () => {}); // iterable contains all non promises
//   // iterable contains one rejectable promise
//   it('should resolve with the value of first promise that fulfills when iterable contains a mix of rejectable and resolvable promises', () => {}); // iterable contains all non promises
//   // all rejectable promises
//   it('should reject with an Aggregate error when iterable contains all rejectable promises', () => {}); // iterable contains all non promises
// });

describe('Testing Promise.race()', () => {
  // return value
  it('should return a pending promise', () => {
    var race = Promise.race([Promise.resolve(33)]);
    expect(race instanceof Promise).toBeTruthy();
  });
  // iterable is empty
  it('should return a forever pending promise if iterable is empty', () => {
    // @TODO: Forever pending promises hang the testRunner.
  });
  // iterable contains all non-promises
  it('should resolve the promise with 1st value of iterable when iterable contains all non-promises', () => {
    return Promise.race([1, 2, 3]).then((data) => {
      expect(data).toEqual(1);
    });
  });
  // iterable contains all resolvable promises
  it('should resolve the promise when first to settle promise is resolved with a value', () => {
    return Promise.race([
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(1000);
        }, 1000);
      }),
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(500);
        }, 500);
      }),
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(100);
        }, 100);
      }),
    ]).then((data) => {
      expect(data).toEqual(100);
    });
  });
  it('should reject the promise when first to settle promise is rejected with a reason', () => {
    return Promise.race([
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(1000);
        }, 1000);
      }),
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(500);
        }, 500);
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(100);
        }, 100);
      }),
    ]).catch((data) => {
      expect(data).toEqual(100);
    });
  });
});

describe('Testing verifySecurityQuestions()', () => {
  it('should return true for all requests where ans to security question is true', () => {
    return verifySecurityQuestions([
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 100);
      }),
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 300);
      }),
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 200);
      }),
    ]).then((data) => expect(data).toEqual([true, true, true]));
  });
  it('should throw error if one of the requests fails', () => {
    expect.assertions(2);
    return verifySecurityQuestions([
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 100);
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            throw new Error('500: internal server error');
          } catch (error) {
            reject(error);
          }
        }, 300);
      }),
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 200);
      }),
    ]).catch((data) => {
      expect(data instanceof Error).toBeTruthy();
      expect(data.message).toEqual('500: internal server error');
    });
  });
});

describe('Testing findActivePhoneNumbers()', () => {
  it('should find all active phone numbers based on the status received from database', () => {
    return findActivePhoneNumbers([
      new Promise((resolve) => {
        setTimeout(() => {
          resolve('active');
        }, 100);
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject('inactive');
        }, 200);
      }),
      new Promise((resolve) => {
        setTimeout(() => {
          resolve('active');
        }, 300);
      }),
    ]).then((status) => {
      expect(status.filter((s) => s.value === 'active').length).toEqual(2);
    });
  });
});

// @TODO: Promise.any() is not a function in jest testRunner
// describe('Testing findTheWinner()', () => {
//   it('should find the first participant to touch the finish line', () => {
//     return findTheWinner([
//       new Promise((resolve) => {
//         setTimeout(() => {
//           resolve('p1');
//         }, 100);
//       }),
//       new Promise((resolve) => {
//         setTimeout(() => {
//           resolve('p2');
//         }, 50);
//       }),
//       new Promise((resolve, reject) => {
//         setTimeout(() => {
//           reject('p3');
//         }, 40);
//       }),
//     ]).then((winner) => expect(winner).toEqual('p2'));
//   });
// });

describe('Testing checkLatency()', () => {
  it('should return true if server responds within 500ms', () => {
    return checkLatency([
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 300);
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject('Server failed to response');
        }, 500);
      }),
    ]).then((data) => expect(data).toBeTruthy());
  });
  it('should return the error message if server fails to respond within 500ms', () => {
    return checkLatency([
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 501);
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject('Server failed to response');
        }, 500);
      }),
    ]).catch((data) => expect(data).toEqual('Server failed to response'));
  });
});
