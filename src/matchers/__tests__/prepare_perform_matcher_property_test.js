var preparePerformMatcherProperty =
  require('../prepare_perform_matcher_property');

describe('preparePerformMatcherProperty', function() {
  beforeEach(function() {
    this.chai = {};
    this.utils = {};
    this.performMatcherProperty = preparePerformMatcherProperty(
      this.chai, this.utils
    );
  });

  it('sets perform flag to true', function() {
    this.utils.flag = sinon.spy();
    var context = {};
    this.performMatcherProperty.call(context);
    expect(this.utils.flag).to.be.calledWith(context, '__perform__', true);
  });
});

