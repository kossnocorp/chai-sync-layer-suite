var syncMatchers = rewire('../sync_matchers');

describe('syncMatchers', function() {
  beforeEach(function() {
    this.preparePerformMatcherProperty = sinon.spy();
    this.prepareRequestMatcherMethod = sinon.spy();

    this.restoreMatchers = rewireMap(syncMatchers, {
      preparePerformMatcherProperty: this.preparePerformMatcherProperty,
      prepareRequestMatcherMethod: this.prepareRequestMatcherMethod
    });

    this.chai = {
      Assertion: {
        addMethod: sinon.spy(),
        addProperty: sinon.spy()
      }
    };
  });

  afterEach(function() {
    this.restoreMatchers();
  });

  describe('"perform" property', function() {
    it('adds property "perform"', function() {
      syncMatchers(this.chai);
      expect(this.chai.Assertion.addProperty).to.be.calledWith('perform');
    });

    it('calls prepare function with chai and utils', function() {
      var utils = {};
      syncMatchers(this.chai, utils);
      expect(this.preparePerformMatcherProperty).to.be.calledWith(
        this.chai, utils
      );
    });
  });

  describe('"request" method', function() {
    it('adds method "request"', function() {
      syncMatchers(this.chai);
      expect(this.chai.Assertion.addMethod).to.be.calledWith('request');
    });

    it('calls prepare function with chai and utils', function() {
      var utils = {};
      syncMatchers(this.chai, utils);
      expect(this.prepareRequestMatcherMethod).to.be.calledWith(
        this.chai, utils
      );
    });
  });
});

