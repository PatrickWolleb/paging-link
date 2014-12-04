/*global describe,it*/
'use strict';
var assert = require('assert'),
  pagingLink = require('../lib/paging-link.js');

describe('paging-link node module.', function() {
  it('must be awesome', function() {
    assert( pagingLink.awesome(), 'awesome');
  });
});
