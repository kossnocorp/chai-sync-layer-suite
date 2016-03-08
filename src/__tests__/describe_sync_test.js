var describeSync = rewire('../describe_sync');

describe('describeSync', function() {
  beforeEach(function() {
    this.obj = {
      __set__: sinon.spy(),
      __get__: sinon.spy()
    };
    this.describe = sinon.spy(function(subjectName, bodyFn) {
      if (bodyFn) {
        bodyFn();
      }
    });
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

  it('calls describe with passed object name', function() {
    describeSync('subjectName', this.obj);
    expect(this.describe).to.be.calledWith('subjectName');
  });

  it('calls body function in describe body', function() {
    var bodyFn = sinon.spy()
    describeSync('subjectName', this.obj, bodyFn);
    var describeBodyFn = this.describe.args[0][1]
    describeBodyFn();
    expect(bodyFn).to.be.called;
  });

  it('adds `with` function to every function defined', function() {
    var obj = {
      a: function() { return this.__with__ },
      __set__: function() {},
      __get__: function() {}
    };
    describeSync('obj', obj);
    this.beforeEach.args[0][0](); // Call assigned beforeEach
    obj.a.with(1, 2, 3);
    expect(obj.a.__with__).to.be.eql([1, 2, 3]);
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

  it('attach __requests__ to every functions', function() {
    var obj = {
      a: function() {},
      __get__: function() {},
      __set__: sinon.spy()
    };
    describeSync('obj', obj);
    this.beforeEach.args[0][0](); // Call assigned beforeEach
    var requests = obj.__set__.args[0][1]; // Extract requests mock
    expect(obj.a.__requests__).to.be.eq(requests);
  });

  it('restores sync to the original state after each test', function() {
    var obj = {
      a: function() { return this.__with__ },
      __get__: function() { return 42 },
      __set__: sinon.spy()
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
    expect(obj.a.__requests__).to.be.undefined;
    expect(obj.__set__).to.be.calledWith('requests', 42);
  });
});

