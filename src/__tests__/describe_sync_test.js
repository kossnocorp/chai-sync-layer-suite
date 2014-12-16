var describeSync = rewire('../describe_sync');

describe('describeSync', function() {
  beforeEach(function() {
    this.obj = { __set__: sinon.spy() };
    this.describe = sinon.spy();
    this.beforeEach = sinon.spy();
    this.afterEach = sinon.spy();

    this.restoreDescribe = injectDependencies(describeSync, {
      describe: this.describe,
      beforeEach: this.beforeEach,
      afterEach: this.afterEach
    });
  });

  afterEach(function() {
    this.restoreDescribe();
  });

  it('calls describe with passed string and body function', function() {
    var bodyFn = function() {};
    describeSync('objectName', this.obj, bodyFn);
    expect(this.describe).to.be.calledWith('objectName', bodyFn);
  });

  it('adds `with` function to every function defined', function() {
    var obj = {
      a: function() { return this.__with__ },
      __set__: function() {}
    };
    describeSync('obj', obj);
    this.beforeEach.args[0][0](); // Call assigned beforeEach
    obj.a.with(1, 2, 3);
    expect(obj.a.__with__).to.be.eql([1, 2, 3]);
  });

  it('restores sync to the original state after each test', function() {
    var obj = {
      a: function() { return this.__with__ },
      __set__: function() {}
    };
    describeSync('obj', obj);

    var testEachContext = {};
    // Call assigned beforeEach
    this.beforeEach.args[0][0].call(testEachContext);
    obj.a.with(1, 2, 3);
    // Call assigned afterEach
    this.afterEach.args[0][0].call(testEachContext);

    expect(obj.a.with).to.be.undefined;
    expect(obj.a.__with__).to.be.undefined;
  });

  it('mock requests object with spy avaliable on context', function() {
    describeSync('obj', this.obj);
    this.beforeEach.args[0][0](); // Call assigned beforeEach
    var requests = this.obj.__set__.args[0][1]; // Extract requests mock
    [
      'get',
      'signedGet',
      'post',
      'signedPost',
      'put',
      'signedPut',
      'delete',
      'signedDelete'
    ].forEach(function(method) {
      expect(requests[method].toString()).to.be.eql('spy');
    })
  });

  it('throw descriptive error if sync is required without rewire', function() {
    expect(function() {
      describeSync('obj', {})
    }).to.throw("Module must be required via rewire (e.g `var answer = require('get-answer');`)")
  });
});

