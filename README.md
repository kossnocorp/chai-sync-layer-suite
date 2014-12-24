# chai-sync-layer-suite

Set of [Chai](http://chaijs.com/) matchers and helpers that simplifies process of testing sync layer (TODO wtf is sync layer).


## Installation

Install via [npm](https://www.npmjs.com/package/chai-sync-layer-suite):

```
npm install --save-dev chai-sync-layer-suite
```

Then require it in your test helper:

``` javascript
// Matchers:
var syncMatchers = require('chai-sync-layer-suite/src/sync_matchers');
chai.use(syncMatchers);

// Describe helper
var describeSync = require('chai-sync-layer-suite/src/describe_sync');
window.describeSync = describeSync; // Export to global scope (window for Karma)
```

## Usage

Real life usage example:

`invitations_sync.js`:
``` javascript
var requests = require('stores/requests');

var invitationsSync = {
  get: function(token) {
    return requests.get('/invitations/' + token);
  },

  create: function(projectId, payload) {
    return requests.signedPost(
      '/projects/' + projectId + '/invitations', payload
    );
  },

  delete: function(token) {
    return requests.signedDelete('/invitations/' + token);
  },

  accept: function(token) {
    return requests.signedPut('/invitations/' + token);
  }
};

module.exports = invitationsSync;
```

`invitations_sync_test.js`:
``` javascript
var invitationsSync = rewire('../invitations_sync');

describeSync('invitationsSync', invitationsSync, function() {
  it('get', function() {
    expect(invitationsSync.get.with('zaq1xsw2')).to.perform.request(
      'get', '/invitations/zaq1xsw2'
    );
  });

  it('create', function() {
    expect(invitationsSync.create.with(42, { a: 'A' })).to.perform.request(
      'signedPost', '/projects/42/invitations', { a: 'A' }
    );
  });

  it('delete', function() {
    expect(invitationsSync.delete.with('zaq1xsw2')).to.perform.request(
      'signedDelete', '/invitations/zaq1xsw2'
    );
  });

  it('accept', function() {
    expect(invitationsSync.accept.with('zaq1xsw2')).to.perform.request(
      'signedPut', '/invitations/zaq1xsw2'
    );
  });
});
```

## Tests

```
npm test
```

For watch mode:

```
npm run-script autotest
```

## Roadmap

* More docs
* Simpler `describeSync` API
* Matchers and helpers for rest parts of sync layer

--

_License (MIT)_
