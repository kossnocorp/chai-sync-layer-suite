
// Chai setup

var chai = require('chai');
global.expect = chai.expect;

chai.use(require('chai-shallow-deep-equal'));

// Sinon

chai.use(require('sinon-chai'));

global.sinon = require('sinon');

// Rewire

global.rewire = require('rewire');

var rewireTestHelpers = require('rewire-test-helpers');
global.rewireMap = rewireTestHelpers.rewireMap;
