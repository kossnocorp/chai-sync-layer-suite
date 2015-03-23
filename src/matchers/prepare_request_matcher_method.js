var prepareRequestMatcherMethod = function(chai, utils) {
  return function(method, path, payload) {
    if (!utils.flag(this, '__perform__')) return;

    this._obj.apply(null, this._obj.__with__);

    var request = this._obj.__requests__[method];
    this.assert(
      payload ? request.calledWith(path, payload) : request.calledWith(path),
      'expected component to perform ' + method + ' request to ' +
      '"' + path + '" with ' + JSON.stringify(payload)
    );
  }
};

module.exports = prepareRequestMatcherMethod;

