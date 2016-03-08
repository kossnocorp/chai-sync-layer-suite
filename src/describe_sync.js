var RewireTestHelpers = require('rewire-test-helpers')

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
  describe(subjectName, function() {
    beforeEach(function() {
      var requests = {
        get: spy(),
        signedGet: spy(),
        post: spy(),
        signedPost: spy(),
        put: spy(),
        signedPut: spy(),
        delete: spy(),
        signedDelete: spy()
      };
      this.__restoreRequests =
        RewireTestHelpers.injectDependencies(subject, {requests: requests})

      this.__syncRestoreFns = Object.keys(subject).reduce(function(acc, key) {
        if (typeof subject[key] == 'function') {
          subject[key].with = function() {
            this.__with__ = Array.prototype.slice.call(arguments);
            return this;
          }

          subject[key].__requests__ = requests;

          return acc.concat(function() {
            delete subject[key].with;
            delete subject[key].__with__;
            delete subject[key].__requests__;
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

      if (typeof this.__restoreRequests === 'function') {
        this.__restoreRequests()
      }
    });

    if (bodyFn) {
      bodyFn();
    }
  });
};

module.exports = describeSync;
