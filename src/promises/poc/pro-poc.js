/* eslint-disable no-unused-vars */
export const proPOC = () => {
  /*
    *====================
        Proof of Concepts in favor of Promises
      ====================
      . Trust
      . Eager execution
      . Reasonable
      . Better than callbacks
      . Sequencing async task
  */
  /**
   * Trust
   *
   * 1. resolve/reject is called only once.
   * 2. If a promise has multiple handlers of a same type registered on it, then same value is passed to all of them.
   *
   */
  const multiResolve = new Promise((res, rej) => {
    res(42);
    res(44);
  });
  const multiReject = new Promise((res, rej) => {
    rej(42);
    rej(44);
  });

  multiResolve.then((val) => {
    console.log(`val in multiResolve: `, val);
  });

  multiReject.then(null, (val) => {
    console.log(`val in multiReject: `, val);
  });

  const multiHandlers = new Promise((res, rej) => {
    res(100);
  });

  multiHandlers.then((val) => {
    console.log(`val in hanlder1: `, val);
  });
  multiHandlers.then((val) => {
    console.log(`val in hanlder2: `, val);
  });
  multiHandlers.then((val) => {
    console.log(`val in hanlder3: `, val);
  });

  /**
   * Eager execution
   *
   */
  var count = 0;

  var eagerPromise = new Promise((res, rej) => {
    count++;
  });

  console.log(`count`, count);

  /**
   * Reasonable
   *
   * 1. returns a placeholder which can be treated as a sync variable.
   */

  const fetchUser = (id) =>
    new Promise((res) => {
      setTimeout(() => {
        res({
          id,
          name: 'John Smith',
        });
      }, 1000);
    });

  const admin = fetchUser(1); //admin can act as a sync variable which can be passed around

  const fetchRecords = (user) => {
    return user.then((val) => {
      return new Promise((res) => {
        setTimeout(() => {
          res(['hi', 'there']);
        }, 1000);
      });
    });
  };

  fetchRecords(admin).then((records) => {
    console.log('Admin records', records);
  });

  /**
   * Better than callbacks
   * . Inversion of control
   *    . Not too many times
   *    . Not too few times
   * . Async + sequential
   * .
   */

  const loggedInUser = {
    isUserLoggedIn: true,
  };
  const loggedOutUser = {
    isUserLoggedIn: false,
  };

  const logStatus = (status) => {
    console.log('User status: ', status);
  };
  // Not too many times
  const tooManyTimesCallback = (user, cb) => {
    const { isUserLoggedIn } = user; // boolean expected
    if (!isUserLoggedIn) {
      cb('LoggedOut');
    }
    cb('LoggedIn'); // else block is intentionally avoided to introduce a situation where cb() is called twice.
  };

  const tooManyTimesPromise = (user) => {
    const { isUserLoggedIn } = user; // boolean expected
    return new Promise((res) => {
      if (!isUserLoggedIn) {
        res('LoggedOut');
      }
      res('LoggedIn');
    });
  };

  console.log('tooManyTimesCallback');
  tooManyTimesCallback(loggedOutUser, logStatus);

  Promise.resolve('tooManyTimesPromise')
    .then(console.log)
    .then(() => tooManyTimesPromise(loggedOutUser))
    .then(logStatus);

  // Not too few times
  const tooFewTimesCallback = (user, cb) => {
    const { isUserLoggedIn } = user; // boolean expected
    if (!isUserLoggedIn) {
      cb('LoggedOut');
    }
  };
  const tooFewTimesPromise = (user) => {
    const { isUserLoggedIn } = user; // boolean expected
    return new Promise((res) => {
      if (!isUserLoggedIn) {
        res('LoggedOut');
      }
      res('LoggedIn');
    });
  };

  console.log('tooFewTimesCallback');
  tooFewTimesCallback(loggedInUser);

  Promise.resolve('tooFewTimesPromise')
    .then(console.log)
    .then(() => tooFewTimesPromise(loggedInUser))
    .then(logStatus);

  // Async + Sequential
  //  getFile exercise from Kyle's course
};
