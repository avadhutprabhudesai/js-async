function fakeAjax(url, cb) {
  var fake_responses = {
    file1: 'The first text',
    file2: 'The middle text',
    file3: 'The last text',
  };
  var randomDelay = (Math.round(Math.random() * 1e4) % 8000) + 1000;

  console.log('Requesting: ' + url);

  setTimeout(function () {
    cb(fake_responses[url]);
  }, randomDelay);
}

function output(text) {
  console.log(text);
}

// **************************************
// The old-n-busted callback way

var response = {};
var order = ['file1', 'file2', 'file3'];

function handleResponse(fileName, content) {
  /**
   *  if fileName is not in response
   *    add an entry
   *  loop over the expected order
   *    if typeof value is string
   *      output
   *      set to false
   *    else
   *      return from function
   *  output complete
   */
  if (!response[fileName]) {
    response[fileName] = content;
  }

  for (let i = 0; i < order.length; i++) {
    if (response[order[i]] == undefined) return;
    if (typeof response[order[i]] == 'string') {
      output(response[order[i]]);
      response[order[i]] = false;
    }
  }
  output('complete');
}

function getFile(file) {
  fakeAjax(file, function (text) {
    // what do we do here?
    handleResponse(file, text);
  });
}

// request all files at once in "parallel"
getFile('file1');
getFile('file2');
getFile('file3');
