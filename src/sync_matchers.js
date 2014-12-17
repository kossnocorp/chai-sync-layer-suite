var preparePerformMatcherProperty =
  require('./matchers/prepare_perform_matcher_property');
var prepareRequestMatcherMethod =
  require('./matchers/prepare_request_matcher_method');

var syncMatchers = function(chai, utils) {
  var Assertion = chai.Assertion;
  Assertion.addProperty('perform', preparePerformMatcherProperty(chai, utils));
  Assertion.addMethod('request', prepareRequestMatcherMethod(chai, utils));
};

module.exports = syncMatchers;

