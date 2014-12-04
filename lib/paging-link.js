/*
 * 
 * https://github.com/PatrickWolleb/paging-link
 *
 * Copyright (c) 2014 Patrick Wolleb
 * Licensed under the MIT license.
 */

'use strict';


var PagingLink = function(options) {
	// Root could be your scheme, host and colletion 
	// limitKey - defaults to "limit"
	// offsetKey - defaults to "offset" 

	this._options = {
	  root : null,
		limitKey : 'limit',
		offsetKey : 'offset',
	};

	if(options) {
		this._options.root = options.root || this._options.root;
		this._options.limitKey = options.limitKey || this._options.limitKey;
		this._options.offsetKey = options.offsetKey || this._options.offsetKey;		
	}
};


PagingLink.prototype = {

	// Renders pagination as HTTP header value 
	toHTTPHeader : function( model, root ) {

		root = root || this._options.root;
		
		var headerValues = [],
				limitKey = this._options.limitKey,
				offsetKey = this._options.offsetKey;

		Object.keys(model).forEach(function(key) {
		  var header = model[key];
		  headerValues.push( '<' + root + '?' + limitKey + '=' + header.limit + '&' + offsetKey + '=' + header.offset + '>; rel="' + key + '"' );
		});

		return headerValues.join(',\n');		
	},

	/* 
	Processes pagination from total DB entries and requested limit offset
	Arguments:
		total 	: int
		limit 	: int
		offset 	: int
	Returns:
		Object possibly containing next, prev and last limit/offset values 
	*/
	process : function( total, limit, offset ) {

		total = parseInt(total);
		limit = parseInt(limit);
		offset = parseInt(offset);

		var model = { last : {} },
				limitKey = this._options.limitKey,
				offsetKey = this._options.offsetKey;
		
		// Do we have a next page		
	  if(total > (limit+offset)) {
	  	model.next = {};
	  	model.next[limitKey] = limit;
	  	model.next[offsetKey] = offset+limit;
	  }

	  // Do we have a previous page
	  if(offset !== 0) {
	  	model.prev = {};
	  	model.prev[limitKey] = (total < limit ? total : limit);
	  	model.prev[offsetKey] = Math.max(0,(offset-limit));
	  }

	  // We always have a last page
	  if(total % limit !== 0) {
	  	model.last[limitKey] = (total % limit);
	  	model.last[offsetKey] = (Math.floor(total / limit) * limit);
	  } else {
	    model.last[limitKey] = ((total % limit) + limit);
	  	model.last[offsetKey] = ((Math.floor(total / limit) * limit) - limit);
	  }

	  return model;
	}

};



module.exports = PagingLink;