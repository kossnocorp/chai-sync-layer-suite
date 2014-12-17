var prepareRequestMatcherMethod = require('../prepare_request_matcher_method');

describe('prepareRequestMatcherMethod', function() {
  beforeEach(function() {
    this.chai = {};
    this.utils = {
      flag: function() { return true }
    };
    this.obj = sinon.spy();
    this.context = {
      assert: sinon.spy(),
      _obj: this.obj
    };
    this.requestMatcherMethod = prepareRequestMatcherMethod(
      this.chai, this.utils
    ).bind(this.context);
  });

  it('stops execution if "__perform__" flag is not defined', function() {
    this.utils.flag = function() { return false };
    this.requestMatcherMethod('get', '/test');
    expect(this.context.assert).to.not.be.called;
  });

  it('calls specefied function with binded arguments', function() {
    this.obj.__with__ = [1, 2, 3];
    this.obj.__requests__ = { get: { calledWith: function() {} } };
    this.requestMatcherMethod('get', '/test');
    expect(this.obj).to.be.calledWith(1, 2, 3);
  });

  it('calls calledWith on request spy', function() {
    this.obj.__with__ = [1, 2, 3];
    this.obj.__requests__ = { get: { calledWith: sinon.spy() } };
    this.requestMatcherMethod('get', '/test', { a: 'A' });
    expect(this.obj.__requests__.get.calledWith).to.be.calledWith(
      '/test', { a: 'A' }
    );
  });
});

