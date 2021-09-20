export const thunks = () => {
  /**
   * sync thunk
   * async thunk
   *
   * eager thunk
   * lazy thunk
   *
   */

  const syncThunkify = (fn) => () => fn();

  const add = (x, y) => x + y;

  const thunkedAddSync = syncThunkify(() => add(5, 5));

  console.log('thunkedAddSync() for 5, 5: ', thunkedAddSync());

  const asyncThunkify = (fn) => (cb) =>
    setTimeout(() => {
      cb(fn());
    }, 1000);

  const thunkedAddAsync = asyncThunkify(() => add(5, 10));
  thunkedAddAsync((result) =>
    console.log('thunkedAddAsync() for 5, 10: ', result)
  );
  const eagerThunkify = (fn, ...params) => {
    var temp = fn(...params);
    return () => temp;
  };

  const lazyThunkify =
    (fn, ...params) =>
    () =>
      fn(...params);

  const eagerAdd = eagerThunkify((x, y) => x + y, 10, 15);
  console.log('Addition with eager thunk: ', eagerAdd());
  const lazyAdd = lazyThunkify((x, y) => x + y, 10, 15);
  console.log('Addition with lazy thunk: ', lazyAdd());
};
