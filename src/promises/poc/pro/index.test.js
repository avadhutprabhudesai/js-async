/* eslint-disable no-unused-vars */
import { fetchRecords, fetchUser, getFile, multiReject, multiResolve } from '.';

describe('PRO POC -> Trust', () => {
  it('a resolve should be called only once', () => {
    return expect(multiResolve()).resolves.toEqual(42);
  });
  it('a reject should be called only once', () => {
    return expect(multiReject()).rejects.toEqual(42);
  });
});

describe('PRO POC -> Eager execution', () => {
  it('should eagerly execute the promise', () => {
    var count = 0;

    var promise = new Promise((res) => {
      count++;
      res(10);
    });
    expect(count).toEqual(1);
    return expect(promise).resolves.toEqual(10);
  });
});

describe('PRO POC -> Reasonable', () => {
  it('a promise should a placeholder which can be passed around as a token for future value', () => {
    const admin = fetchUser(1);
    return expect(fetchRecords(admin)).resolves.toEqual(['hi', 'there']);
  });
});

describe('PRO POC -> Sequencing async tasks', () => {
  var content = '';
  const appendContent = (data) => {
    content += data;
  };
  it('should sequence async task which run to completion at different point in time', () => {
    /**
     * Initiate get request for 3 files
     * Each file will be fetched at different time.
     * Line up the outputs with promises so that output string contains data1 + data2 + data3
     */

    var file1 = getFile('file1');
    var file2 = getFile('file2');
    var file3 = getFile('file3');
    return file1
      .then(appendContent)
      .then(() => file2)
      .then(appendContent)
      .then(() => file3)
      .then(appendContent)
      .then(() => expect(content).toEqual('file1file2file3'));
  });
});
