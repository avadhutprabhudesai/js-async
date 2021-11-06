export const valEmitter = (arr = []) => {
  let i = 0;
  return () => (i < arr.length ? arr[i++] : undefined);
};

export const generator = (arr = []) => {
  let i = 0;
  return {
    next: () => (i < arr.length ? arr[i++] : undefined),
  };
};

export const iterator = (arr = []) => {
  let i = 0;
  return {
    next: () =>
      i < arr.length
        ? { value: arr[i++], done: false }
        : { value: undefined, done: true },
  };
};

export const iterable = (arr = []) => {
  return {
    [Symbol.iterator]() {
      return iterator(arr);
    },
  };
};

export const reverseIterable = (arr = []) => {
  return {
    [Symbol.iterator]: function () {
      let i = arr.length - 1;
      return {
        next: () => {
          return i >= 0
            ? { value: arr[i--], done: false }
            : { value: undefined, done: true };
        },
      };
    },
  };
};

export function* reverseGenerator(arr = []) {
  let i = arr.length - 1;
  while (i >= 0) {
    yield arr[i--];
  }
}

export function* counterGen() {
  let i = 0,
    result;
  while (i < 10) {
    result = yield ++i;
    if (result) {
      i = result;
    }
  }
}

export function* evenArrayGen(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (i % 2 === 0) {
      yield arr[i];
    }
  }
}

export function* repeat(arr = []) {
  let i = arr.length;
  while (true) {
    yield arr[i++ % arr.length];
  }
}
