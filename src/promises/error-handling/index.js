export const errorHandling = () => {
  /**
   * .then() second function
   * .catch() method
   * .catch() vs .then() for error handling
   *    continue with the chain
   *    break the promise chain
   * .catch() chaining
   * .Uncaught errors
   * .nested catch()
   * .finally()
   * .How to manage fetch() error handling centrally
   */

  /**
   * then() onRejectHandler
   * 1. returns a value
   * 2. returns a rejected promise
   * 3. throws an error
   * 4. trickle down
   */

  Promise.reject('Error Handling: Promise rejected for case 1.1')
    .then(null, (rejValue) => {
      console.log(rejValue);
      return 3000;
    })
    .then(onResolve, onReject);

  Promise.reject('Error Handling: Promise rejected for case 1.2')
    .then(null, (rejValue) => {
      console.log(rejValue);
      return Promise.reject(4000);
    })
    .then(onResolve, onReject);
  Promise.reject('Error Handling: Promise rejected for case 1.3')
    .then(null, (rejValue) => {
      console.log(rejValue);
      throw new Error('Error is thrown');
    })
    .then(onResolve, onReject);

  Promise.reject('Error handling: Promise rejected for case 1.4')
    .then(onResolve)
    .then(onResolve)
    .then(onResolve)
    .then(onResolve, onReject);

  /**
   * catch() method
   * 1.what does it return
   *    returns a promise
   *    if onReject throws an error or returns a rejected promise, then catch() rejects the promise, else resolves
   * 2. catch() at the end vs catch() in between
   * 3. errors
   *    sync errors from promise
   *    async errors from promise
   *    errors thrown from catch()
   */

  // returns a resolved promise with the value
  Promise.reject('Error handling: Promise rejected for case 2.1.1')
    .catch((val) => {
      console.log(val);
      return 'Error handling: value 2.1.1';
    })
    .then(onResolve, onReject);

  // returns rejected promise if catch() returns rejected promise or throws error.
  Promise.reject('Error handling: Promise rejected for case 2.1.2')
    .catch((val) => {
      console.log(val);
      return Promise.reject('Error handling: promise rejected 2.1.2');
    })
    .then(onResolve, onReject);

  // catch() at the end of a chain
  async1(2)
    .then(async1)
    .then(async1)
    .then(async1)
    .catch((value) => {
      console.log(`Error handling: async1 catch block called with ${value}`);
    });

  // catch() iin between the chain
  async2(2)
    .catch((value) => {
      console.log(`Error handling: async2 catch block called with ${value}`);
    })
    .then(async2)
    .catch((value) => {
      console.log(`Error handling: async2 catch block called with ${value}`);
    })
    .then(async2)
    .catch((value) => {
      console.log(`Error handling: async2 catch block called with ${value}`);
    })
    .then(async2)
    .catch((value) => {
      console.log(`Error handling: async2 catch block called with ${value}`);
    });

  // sync errors from promise
  new Promise(() => {
    throw new Error('Error handling: sync error from promise');
  })
    .then(onResolve)
    .catch((rejection) => {
      console.log(rejection);
    });

  // sync errors from promise
  new Promise(() => {
    setTimeout(() => {
      throw new Error(
        'Error handling: async error from promise which never gets caught by the code'
      );
    }, 1000);
  })
    .then(onResolve)
    .catch((rejection) => {
      console.log(rejection);
    });

  // error thrown from catch()
  rethrow().then(onResolve, onReject).catch(console.log);

  /*









  */

  function onResolve(val) {
    console.log('Error handling: success handler: ', val);
  }
  function onReject(val) {
    console.log('Error handling: error handler: ', val);
  }
  function async1(value) {
    console.log(`Error handling: async1 function received: ${value}`);
    return new Promise((res, rej) => {
      const random = (Math.random() * 10) | 0;
      console.log(`Error handling: async1 function generated ${random}`);
      if (random < 2) {
        res(random);
      }
      rej(random);
    });
  }
  function async2(value) {
    console.log(`Error handling: async2 function received: ${value}`);
    return new Promise((res, rej) => {
      const random = (Math.random() * 10) | 0;
      console.log(`Error handling: async2 function generated ${random}`);
      if (random < 2) {
        res(random);
      }
      rej(random);
    });
  }

  function rethrow() {
    return new Promise((res, rej) => {
      rej();
    }).catch(() => {
      throw new Error('Error handling: error rethrown from catch()');
    });
  }
};
