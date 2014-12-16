var prepareRequestMatcherMethod = require('../prepare_request_matcher_method');

describe('prepareRequestMatcherMethod', function() {
  beforeEach(function() {
    this.chai = {};
    this.utils = {};
    this.requestMatcherMethod = prepareRequestMatcherMethod(
      this.chai, this.utils
    );
  });
});

