/**
 * Create iterator
 * Create a generator
 * Create a function which emits values of an array in reverse order using iterable protocol
 * Rewrite same function using generators
 *
 
 */

import {
  generator,
  iterable,
  iterator,
  reverseGenerator,
  reverseIterable,
  valEmitter,
} from '.';

describe('Testing value emitter function', () => {
  var emitter = valEmitter([1, 2, 3, 4]);
  it('should return a function', () => {
    expect(typeof emitter).toEqual('function');
  });
  it('the returned function should emit a single value per call', () => {
    expect(emitter()).toEqual(1);
    expect(emitter()).toEqual(2);
    expect(emitter()).toEqual(3);
    expect(emitter()).toEqual(4);
  });
  it('the returned function should emit nothing after all values from the collection have been emitted already', () => {
    let emitter = valEmitter([1]);
    emitter();
    expect(emitter()).toBeUndefined();
  });
});

describe('Testing generator function', () => {
  var gen = generator([1, 2, 3, 4]);
  it('should return an object with next method', () => {
    expect(gen).toEqual(
      expect.objectContaining({
        next: expect.any(Function),
      })
    );
  });
  it("the returned object's next method should emit a single value per call", () => {
    expect(gen.next()).toEqual(1);
    expect(gen.next()).toEqual(2);
    expect(gen.next()).toEqual(3);
    expect(gen.next()).toEqual(4);
  });
  it("the returned object's next method should emit nothing after all values from the collection have been emitted already", () => {
    let gen = generator([1]);
    gen.next();
    expect(gen.next()).toBeUndefined();
  });
});

describe('Testing iterator', () => {
  var itr = iterator([1, 2, 3]);
  it('should return an object', () => {
    expect(typeof itr).toEqual('object');
  });
  it('should return an object which contains next method', () => {
    expect(itr).toEqual(
      expect.objectContaining({
        next: expect.any(Function),
      })
    );
  });
  it('next method should emit a value in serial fashion when it is invoked', () => {
    expect(itr.next().value).toEqual(1);
    expect(itr.next().value).toEqual(2);
    expect(itr.next().value).toEqual(3);
  });
});

describe('Testing iterable', () => {
  var itrb = iterable([1, 2, 3, 4]);
  it('should return an object', () => {
    expect(typeof itrb).toEqual('object');
  });
  it('should return an object which contains [Symbol.iterator] method', () => {
    expect(itrb).toEqual(
      expect.objectContaining({
        [Symbol.iterator]: expect.any(Function),
      })
    );
  });
  it("the returned object's [Symbol.iterator] method should return an iterator object", () => {
    expect(itrb[Symbol.iterator]()).toEqual(
      expect.objectContaining({
        next: expect.any(Function),
      })
    );
  });
  it('the iterator object retured by iterable should emit values with next()', () => {
    var itr = itrb[Symbol.iterator]();
    expect(itr.next().value).toEqual(1);
    expect(itr.next().value).toEqual(2);
    expect(itr.next().value).toEqual(3);
  });
  it('the iterable should be traversible with for-of loof', () => {
    var result = 0;
    for (let val of itrb) {
      result += val;
    }
    expect(result).toEqual(10);
  });
});

describe('Testing array reverser iterable', () => {
  var revIterable = reverseIterable([1, 2, 3, 4]);
  it('should return an object', () => {
    expect(typeof revIterable).toEqual('object');
  });
  it('should return an object which contains [Symbol.iterator] method', () => {
    expect(revIterable).toEqual(
      expect.objectContaining({
        [Symbol.iterator]: expect.any(Function),
      })
    );
  });
  it("the returned object's [Symbol.iterator] method should return an iterator object", () => {
    expect(revIterable[Symbol.iterator]()).toEqual(
      expect.objectContaining({
        next: expect.any(Function),
      })
    );
  });
  it('the iterator object retured by iterable should emit values with next()', () => {
    var itr = revIterable[Symbol.iterator]();
    expect(itr.next().value).toEqual(4);
    expect(itr.next().value).toEqual(3);
    expect(itr.next().value).toEqual(2);
    expect(itr.next().value).toEqual(1);
  });
  it('the iterable should be traversible with for-of loof', () => {
    var result = 0;
    for (let val of revIterable) {
      result += val;
    }
    expect(result).toEqual(10);
  });
});

describe('Testing array reverser generator', () => {
  var revGenerator = reverseGenerator([1, 2, 3, 4]);
  it('should return an iterator with next() method', () => {
    expect(revGenerator).toEqual(
      expect.objectContaining({
        next: expect.any(Function),
      })
    );
  });
  it('should return arrays in reverse order with every invokation of next method', () => {
    expect(revGenerator.next().value).toEqual(4);
    expect(revGenerator.next().value).toEqual(3);
    expect(revGenerator.next().value).toEqual(2);
    expect(revGenerator.next().value).toEqual(1);
  });
});
