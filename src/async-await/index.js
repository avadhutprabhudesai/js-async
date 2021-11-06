export const checkAsyncReturn = async (val) => {
  return val;
};
export const asyncThrowError = async () => {
  throw new Error('Error thrown from async');
};

export const fetchData = (data) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, (Math.random * 100) | 0);
  });

export const getFruitNums = (fruit) => {
  const fruits = {
    apple: 50,
    orange: 20,
    banana: 10,
  };
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fruits[fruit]);
    }, (Math.random() * 1000) | 0);
  });
};
