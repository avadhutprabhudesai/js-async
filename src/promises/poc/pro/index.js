export const multiResolve = () =>
  new Promise((res) => {
    res(42);
    res(52);
  });

export const multiReject = () =>
  new Promise((res, rej) => {
    rej(42);
    rej(44);
  });

export const fetchUser = (id) =>
  new Promise((res) => {
    setTimeout(() => {
      res({
        id,
        name: 'John Smith',
      });
    }, 1000);
  });

export const fetchRecords = (user) => {
  return user.then(() => {
    return new Promise((res) => {
      setTimeout(() => {
        res(['hi', 'there']);
      }, 1000);
    });
  });
};

export const getFile = (fileName) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(`${fileName}`);
    }, (Math.random() * 100) | 0);
  });
};
