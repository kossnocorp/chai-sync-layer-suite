var preparePerformMatcherProperty = function(chai, utils) {
  return function() {
    utils.flag(this, '__perform__', true);
  };
};

module.exports = preparePerformMatcherProperty;

