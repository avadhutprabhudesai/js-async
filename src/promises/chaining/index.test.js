/* eslint-disable no-unused-vars */
/**
  * Return value of .then() method
  * nothing
  * a value
  * a resolved promise
  * a rejected promise
  * a pending promise
  * throws error
 
  * chain after a failure

  * Promise hell
    . nested .then() with linearly dependent promises (every promise depends on an input from previous promise)
    . nested .then() with multiple dependent promises (Promises which require data from more than one random previouses promises in the chain)
      
  * examples
    . dynamic chaining in serial fashion
    . dynamic chaining in parallel fashion
 */

describe('Chaining -> nothing is returned from .then()', () => {
  it('should return a pending promise which resolves to undefined if success callback returns nothing', () => {
    var retNothing = Promise.resolve(42).then(() => {}); // successCallback of .then() returns nothing
    expect(retNothing instanceof Promise).toBeTruthy();
    return retNothing.then((data) => {
      expect(data).toBeUndefined();
      expect(data).not.toEqual(3);
    });
  });
  it('should return a pending promise which resolves to undefined if error callback returns nothing', () => {
    var retNothing = Promise.reject(42).then(null, () => {}); // errorCallback of .then() returns nothing
    expect(retNothing instanceof Promise).toBeTruthy();
    return retNothing.then((data) => {
      expect(data).toBeUndefined();
      expect(data).not.toEqual(3);
    });
  });
});

describe('Chaining -> a value is returned from .then()', () => {
  it('should return a pending promise which resolves to the value if a value is returned from successCallback', () => {
    var retVal = Promise.resolve(42).then(() => 400); // successCallback of .then() returns a value
    expect(retVal instanceof Promise).toBeTruthy();
    return retVal.then((data) => {
      expect(data).toEqual(400);
    });
  });
  it('should return a pending promise which resolves to the value if a value is returned from errorCallback', () => {
    var retVal = Promise.reject(42).then(null, () => 500); // errorCallback of .then() returns a value
    expect(retVal instanceof Promise).toBeTruthy();
    return retVal.then((data) => {
      expect(data).toEqual(500);
    });
  });
});

describe('Chaining -> a resolved promise is returned from .then()', () => {
  it('should return a pending promise which resolves to the resolved value of the promise if a resolved promise is returned from successCallback', () => {
    var retResolved = Promise.resolve(42).then(() => Promise.resolve(100)); // successCallback of .then() returns a resolved promise
    expect(retResolved instanceof Promise).toBeTruthy();
    return retResolved.then((data) => {
      expect(data).toEqual(100);
    });
  });
  it('should return a pending promise which resolves to the resolved value of the promise if a resolved promise is returned from errorCallback', () => {
    var retResolved = Promise.reject(42).then(null, () => Promise.resolve(200)); // errorCallback of .then() returns a resolved promise
    expect(retResolved instanceof Promise).toBeTruthy();
    return retResolved.then((data) => {
      expect(data).toEqual(200);
    });
  });
});

describe('Chaining -> a rejected promise is returned from .then()', () => {
  it('should return a pending promise which rejects with the rejected value of the promise if a rejected promise is returned from successCallback', () => {
    var retRejected = Promise.resolve(42).then(() => Promise.reject(100)); // successCallback of .then() returns a rejected promise
    expect(retRejected instanceof Promise).toBeTruthy();
    return retRejected.then(null, (data) => {
      expect(data).toEqual(100);
    });
  });
  it('should return a pending promise which rejects with the rejected value of the promise if a rejected promise is returned from errorCallback', () => {
    var retRejected = Promise.reject(42).then(null, () => Promise.reject(200)); // errorCallback of .then() returns a rejected promise
    expect(retRejected instanceof Promise).toBeTruthy();
    return retRejected.then(null, (data) => {
      expect(data).toEqual(200);
    });
  });
});

describe('Chaining -> a pending promise is returned from .then()', () => {
  it('should return a pending promise which resolves/rejects with the value of the promise if a pending promise is returned from successCallback', () => {
    var retPending = Promise.resolve(42).then(
      () => new Promise((resolve) => resolve(300))
    ); // successCallback of .then() returns a pending promise
    expect(retPending instanceof Promise).toBeTruthy();
    return retPending.then((data) => {
      expect(data).toEqual(300);
    });
  });
  it('should return a pending promise which resolves/rejects with the value of the promsie if a pending promise is returned from errorCallback', () => {
    var retPending = Promise.reject(42).then(
      null,
      () => new Promise((resolve) => resolve(300))
    ); // errorCallback of .then() returns a pending promise
    expect(retPending instanceof Promise).toBeTruthy();
    return retPending.then((data) => {
      expect(data).toEqual(300);
    });
  });
});

describe('Chaining -> chain after a failure', () => {
  it('the promise chain should continue with subsequent handlers if one throws the error and subsequent catch block handles it', () => {
    return Promise.resolve(100)
      .then((data) => {
        return data + 10;
      })
      .then((data) => {
        return data + 10;
      })
      .then((data) => {
        throw new Error('Something went wrong');
      })
      .catch((error) => {
        /**handle the error gracefully */
        console.log(`error`, error);
        return 'recovered from error';
      })
      .then((data) => {
        expect(data).toEqual('recovered from error');
      });
  });
});

const getPatty = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('patty');
    }, 100);
  });
};

const grill = (patty) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('grilled patty');
    }, 200);
  });
};

const makeBurger = (grilledPatty) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Burger with grilled patty between breads');
    }, 50);
  });
};

describe('Chaining -> nested .then() with linearly dependent promises ', () => {
  it('is an example of badly implemented promise hell ', () => {
    // getPatty() -> grill() -> makeBurger()
    return getPatty().then((patty) => {
      return grill(patty).then((grilledPatty) => {
        return makeBurger(grilledPatty).then((burger) => {
          expect(burger).toEqual('Burger with grilled patty between breads');
        });
      });
    });
  });

  it('is an example of correct implementation using promise chain', () => {
    return getPatty()
      .then(grill)
      .then(makeBurger)
      .then((burger) => {
        expect(burger).toEqual('Burger with grilled patty between breads');
      });
  });
});

const login = (username, password) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        userame: username,
      });
    }, 10);
  });

const getPreferences = (user) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Preferences');
    }, 40);
  });

const getTransactions = (user) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Transactions');
    }, 40);
  });

const prepareDashboard = (preferences, transactions) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Custom Dashboard');
    }, 30);
  });

describe('Chaining -> nested .then() multiple dependent promises', () => {
  it('is an example of incorrect implementation of promise chain', () => {
    return login('john', '1234').then((user) => {
      return getPreferences(user).then((preferences) => {
        return getTransactions(user).then((transactions) => {
          return prepareDashboard(preferences, transactions).then(
            (dashboard) => {
              expect(dashboard).toEqual('Custom Dashboard');
            }
          );
        });
      });
    });
  });

  it('is an example of correct implementation of promise chaining', () => {
    const loginPromise = login('john', '1234');

    const getPreferencesPromise = loginPromise.then(getPreferences);
    const getTransactionsPromise = loginPromise.then(getTransactions);

    return Promise.all([getPreferencesPromise, getTransactionsPromise]).then(
      ([preferences, transactions]) => {
        return prepareDashboard(preferences, transactions).then((dashboard) =>
          expect(dashboard).toEqual('Custom Dashboard')
        );
      }
    );
  });
});

/**
    Given an array of file names

    1. Download all files in serial fashion and arrange the output in the sequence. Skip the files for which error occured.
    2. Download all files in parallel but arrange the output in the same order as the file names array
 */

var files = ['file1', 'file2', 'file3'];

const downloadFile = (fileName) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`${fileName}`);
    }, (Math.random() * 100) | 0);
  });

// Case 1
describe('Chaining -> Dynamic sequencing in serial fashion', () => {
  it('should concatenate the content of all files in the same order as array but files must be downloaded one after the other', () => {
    var content = '';
    const allFiles = files.reduce((acc, val) => {
      return acc.then((accContent) => {
        return downloadFile(val).then((fileCotent) => {
          return accContent + fileCotent;
        });
      });
    }, Promise.resolve(''));

    return allFiles.then((data) => expect(data).toEqual('file1file2file3'));
  });
});
// Case 2
describe('Chaining -> Dynamic sequencing in parallel fashion', () => {
  it('should concatenate the result of all files in the same order as array but files can be downloaded in parallel', () => {
    return Promise.all(files.map(downloadFile)).then((params) => {
      expect(params.join('')).toEqual('file1file2file3');
    });
  });
});
