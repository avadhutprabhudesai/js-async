/**
 * Examples
 * . Write a generator function which prints out numbers starting from 1. If a number is provided to it in between,
 *   then it starts printing from that num
 
*  . Create an iterable array from input array which spreads values at even indexes when used with spread operator

*  . Create a generator for repeater array
 
 */

import { counterGen, evenArrayGen, repeat } from '.';

describe('Testing generator funtion for counter till 10', () => {
  it('should emit values one at a time, starting from 1', () => {
    var counter = counterGen();
    expect(counter.next().value).toEqual(1);
  });
  it('should fast forward to a number provided to .next()', () => {
    var counter = counterGen();
    expect(counter.next().value).toEqual(1);
    expect(counter.next(5).value).toEqual(6);
    expect(counter.next().value).toEqual(7);
    expect(counter.next().value).toEqual(8);
  });
  it('should emit values till 10 only', () => {
    var counter = counterGen();
    expect(counter.next().value).toEqual(1);
    expect(counter.next(9).value).toEqual(10);
    expect(counter.next().value).toEqual(undefined);
  });
});

describe('Testing custom iterator for array', () => {
  it('should return an iterator which yields array values at even indexes', () => {
    var evenArr = evenArrayGen([1, 2, 3, 4, 5, 6]);
    expect(evenArr.next().value).toEqual(1);
    expect(evenArr.next().value).toEqual(3);
    expect(evenArr.next().value).toEqual(5);
  });
  it('should spread only values at even indexes when used with spread operator', () => {
    var evenArr = evenArrayGen([1, 2, 3, 4, 5, 6]);
    expect([...evenArr]).toEqual([1, 3, 5]);
  });
  it('should produce values at even idexes only with for-of loop', () => {
    var evenArr = evenArrayGen([1, 2, 3, 4, 5, 6]);
    var result = [];
    for (const iterator of evenArr) {
      result.push(iterator);
    }
    expect(result).toEqual([1, 3, 5]);
  });
});

describe('Testing array repeater', () => {
  it('should generate the values from the input array in repeat fashion', () => {
    var arrRepeatGen = repeat([1, 2, 3]);
    expect(arrRepeatGen.next().value).toEqual(1);
    expect(arrRepeatGen.next().value).toEqual(2);
    expect(arrRepeatGen.next().value).toEqual(3);
    expect(arrRepeatGen.next().value).toEqual(1);
    expect(arrRepeatGen.next().value).toEqual(2);
    expect(arrRepeatGen.next().value).toEqual(3);
  });
});
