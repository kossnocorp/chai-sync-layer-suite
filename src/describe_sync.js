var _global;
if (typeof global != 'undefined') {
  _global = global;
} else if (typeof window != 'undefined') {
  _global = window;
}

var sinon = _global.sinon;
var spy;
if (sinon) {
  spy = sinon.spy;
} else {
  spy = function() {};
}

var describe = _global.describe;
var beforeEach = _global.beforeEach;
var afterEach = _global.afterEach;

var describeSync = function(subjectName, subject, bodyFn) {
  if (!subject.__set__) {
    throw "Module must be required via rewire (e.g `var answer = require('get-answer');`)"
  }

  beforeEach(function() {
    subject.__set__('requests', {
      get: spy(),
      signedGet: spy(),
      post: spy(),
      signedPost: spy(),
      put: spy(),
      signedPut: spy(),
      delete: spy(),
      signedDelete: spy()
    });

    this.__syncRestoreFns = Object.keys(subject).reduce(function(acc, key) {
      if (typeof subject[key] == 'function') {
        subject[key].with = function() {
          this.__with__ = Array.prototype.slice.call(arguments);
          return this;
        }

        return acc.concat(function() {
          delete subject[key].with;
          delete subject[key].__with__;
        });

      } else {
        return acc;
      }
    }, []);
  });

  afterEach(function() {
    if (this.__syncRestoreFns) {
      this.__syncRestoreFns.forEach(function(fn) { fn() });
    }
  });

  describe(subjectName, bodyFn);
};

module.exports = describeSync;

