/* eslint-disable no-unused-vars */
/**
 * onRejectHandler vs catch
 * reject vs throw
 * position of catch block
 * rethrowing
 *
 * examples
 *      . break the chain if error occurs
 *      . continue the chain if error occurs
 *      . errors outside and inside the promise
 */

describe('onReject vs catch', () => {
  it('is an example where rejection by success handler is not caught by the error callback', () => {
    expect.assertions(1);
    return Promise.resolve(100).then(
      (data) => {
        expect(data).toEqual(100);
        return 2;
        // Uncommenting this code would result in unhandled rejection which stops the jest test runner extension.
        // Promise.reject('Rejected from success handler');
      },
      (reason) => {
        expect(reason).toBeUndefined();
        expect(reason).not.toEqual('Rejected from success handler');
      }
    );
  });

  it('is an example where rejection from success callback is handled by catch()', () => {
    expect.assertions(3);
    return Promise.resolve(100)
      .then((data) => {
        expect(data).toEqual(100);
        return Promise.reject('Rejected from success handler');
      })
      .catch((reason) => {
        expect(reason).not.toBeUndefined();
        expect(reason).toEqual('Rejected from success handler');
      });
  });
});

describe('reject vs throw', () => {
  it('is an example where reject from inside the promise is caught by the catch()', () => {
    return new Promise((resolve, reject) => {
      reject('Rejected synchronously from inside the promise');
    }).catch((rejection) => {
      expect(rejection).toEqual(
        'Rejected synchronously from inside the promise'
      );
    });
  });
  it('is an example where throw from inside the promise is caught by the catch()', () => {
    return new Promise((resolve, reject) => {
      throw 'Rejected synchronously from inside the promise';
    }).catch((rejection) => {
      expect(rejection).toEqual(
        'Rejected synchronously from inside the promise'
      );
    });
  });
  it('is an example where reject from async function from inside the promise is caught by the catch()', () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Reject from async function');
      }, 40);
    }).catch((rejection) => {
      expect(rejection).toEqual('Reject from async function');
    });
  });

  // the test is skipped as it is expected to crash.
  it.skip('is an example where throw from async function from inside the promise is not caught by the catch()', () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // this throw is never caught by the catch block of this promise. It is treated as Uncaught exception and the test fails.
        throw 'Reject from async function';
      }, 40);
    }).catch((rejection) => {
      expect(rejection).toEqual('Reject from async function');
    });
  });
});

describe('position of catch block before then', () => {
  expect.assertions(2);
  it('should be able to catch reject from promise', () => {
    return new Promise((resolve, reject) => {
      reject('Reject from promise');
    })
      .catch((reason) => {
        expect(reason).toEqual('Reject from promise');
      })
      .then((data) => {
        expect(data).toBeUndefined();
      });
  });
  it('should be able to catch throw from promise', () => {
    return new Promise((resolve, reject) => {
      throw 'Throw from promise';
    })
      .catch((reason) => {
        expect(reason).toEqual('Throw from promise');
      })
      .then((data) => {
        expect(data).toBeUndefined();
      });
  });

  // These tests fail as there is nothing to catch reject/throw from .then()
  it.skip('should not be able to catch reject from .then()', () => {
    return new Promise((resolve, reject) => {
      resolve(100);
    })
      .catch((reason) => {})
      .then((data) => {
        expect(data).toEqual(100);
        return Promise.reject('Nothing is there to handle this reject');
      });
  });
  it.skip('should not be able to catch throw from .then()', () => {
    return new Promise((resolve, reject) => {
      resolve(100);
    })
      .catch((reason) => {})
      .then((data) => {
        expect(data).toEqual(100);
        throw 'Nothing is there to handle this throw';
      });
  });
});

describe('position of catch block after then', () => {
  it('should be able to catch reject from promise', () => {
    return new Promise((resolve, reject) => {
      return reject('Reject from promise');
    })
      .then((data) => {
        expect(data).toBeUndefined();
      })
      .catch((reason) => {
        expect(reason).toEqual('Reject from promise');
      });
  });
  it('should be able to catch throw from promise', () => {
    return new Promise((resolve, reject) => {
      throw 'Throw from promise';
    })
      .then((data) => {
        expect(data).toBeUndefined();
      })
      .catch((reason) => {
        expect(reason).toEqual('Throw from promise');
      });
  });

  it('should be able to catch reject from .then()', () => {
    return new Promise((resolve, reject) => {
      resolve(100);
    })
      .then((data) => {
        expect(data).toEqual(100);
        return Promise.reject('Promise.reject() from .then()');
      })
      .catch((reason) => {
        expect(reason).toEqual('Promise.reject() from .then()');
      });
  });
  it('should be able to catch throw from .then()', () => {
    return new Promise((resolve, reject) => {
      resolve(100);
    })
      .then((data) => {
        expect(data).toEqual(100);
        throw 'throw from .then()';
      })
      .catch((reason) => {
        expect(reason).toEqual('throw from .then()');
      });
  });
});

describe('a catch block in between', () => {
  it('should allow the promise chain to continue if catch does not reject or throw', () => {
    return Promise.resolve(100)
      .then((data) => {
        expect(data).toEqual(100);
        return Promise.reject(200);
      })
      .catch((reason) => {
        expect(reason).toEqual(200);
        return Promise.resolve(300);
      })
      .then((data) => {
        expect(data).toEqual(300);
      });
  });
});

describe('catch block rethrowing', () => {
  it('is an example where catch block rethrows the error and it is handled by the closest catch block', () => {
    expect.assertions(1);
    return new Promise((resolve, reject) => {
      throw new Error('Some custom error');
    })
      .catch((error) => {
        if (!(error instanceof URIError))
          throw 'Rethrowing error to .catch() block';
      })
      .then((data) => {})
      .catch((error) => {
        expect(error).toEqual('Rethrowing error to .catch() block');
      });
  });
  it('is an example where catch block rethrows the error and it is handled by the closest .then() errorCallback', () => {
    expect.assertions(1);
    return new Promise((resolve, reject) => {
      throw new Error('Some custom error');
    })
      .catch((error) => {
        if (!(error instanceof URIError))
          throw 'Rethrowing error to .then() errorCallback';
      })
      .then(
        (data) => {},
        (reason) => {
          expect(reason).toEqual('Rethrowing error to .then() errorCallback');
        }
      )
      .catch((error) => {
        expect(error).toEqual('Error type cannot be handled');
      });
  });
});

const verifyCard = () =>
  new Promise((res, rej) =>
    Math.floor(Math.random() * 10) === 5
      ? rej('Invalid card')
      : res('Valid card')
  );
const verifyPin = () =>
  new Promise((res, rej) =>
    Math.floor(Math.random() * 10) > 9.5 ? res('Valid pin') : rej('Invalid pin')
  );
const verifyAmount = () =>
  new Promise((res, rej) =>
    Math.floor(Math.random() * 10) < 2
      ? res('Valid amount')
      : rej('Invalid amount')
  );

// break the chain after rejection
describe('Break the chain after rejection', () => {
  it('should break the chain of promises after first rejection', () => {
    return verifyCard()
      .then((card) => {
        expect(card).toEqual('Valid card');
        return verifyPin();
      })
      .then((pin) => {
        expect(pin).toEqual('Valid pin');
        return verifyAmount();
      })
      .then((amount) => {
        expect(amount).toEqual('Valid amount');
      })
      .catch((reason) => {
        expect(
          ['Invalid card', 'Invalid pin', 'Invalid amount'].includes(reason)
        ).toBeTruthy();
      });
  });
});

// continue the chain after rejection
describe('Continue the chain after rejection', () => {
  const fetchMenu = jest.fn((country) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.floor(Math.random() * 10) > 6) {
          resolve(`${country} menu`);
        }
        reject('Menu cannot be fetched');
      }, 40);
    }).catch((reason) => {
      expect(reason).toEqual('Menu cannot be fetched');
      return Promise.resolve();
    });
  });
  it('should continue with the promise chain after rejection', () => {
    return fetchMenu('India')
      .then(() => fetchMenu('China'))
      .then(() => fetchMenu('Italy'))
      .then(() => expect(fetchMenu).toHaveBeenCalledTimes(3));
  });
});

describe('Errors outside the promise', () => {
  it('should call the tryCatch instead of the .catch() of promise', () => {
    const verifyUser = (user) => {
      if (!user) throw 'User is not valid';
      return new Promise((res, rej) => {
        setTimeout(() => {
          res('Valid user');
        }, 20);
      });
    };

    try {
      return verifyUser(null)
        .then((user) => {
          expect(user).toEqual('Valid user');
        })
        .catch((reason) => {
          expect(reason).toBeUndefined();
        });
    } catch (error) {
      expect(error).toEqual('User is not valid');
    }
  });
});
describe('Errors inside the promise', () => {
  it('should call the .catch() of the promise instead of the tryCatch outside', () => {
    const verifyUser = (user) => {
      return new Promise((res, rej) => {
        if (!user) throw 'User is not valid';
        setTimeout(() => {
          res('Valid user');
        }, 20);
      });
    };

    try {
      return verifyUser(null)
        .then((user) => {
          expect(user).toEqual('Valid user');
        })
        .catch((reason) => {
          expect(reason).toEqual('User is not valid');
        });
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });
});
