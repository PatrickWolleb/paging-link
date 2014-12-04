/*
 * 
 * https://github.com/PatrickWolleb/paging-link
 *
 * Copyright (c) 2014 Patrick Wolleb
 * Licensed under the MIT license.
 */

'use strict';


// Root is your scheme, host and colletion 
// limitKey - defaults to "limit"
// offsetKey - defaults to "offset" 
var _options = {

	limitKey : 'limit',
	offsetKey : 'offset',

};


function process( total, limit, offset, root ) {

	root = root || _options.root;


	var headerValues = [],
			limitKey = _options.limitKey,
			offsetKey = _options.offsetKey;

	
	// Do we have a next page		
  if(total > (limit+offset)) {
    headerValues.push( '<' + root + '?' + limitKey + '=' + limit + '&' + offsetKey + '=' + (offset+limit) + '>; rel="next"' );
  }

  // Do we have a previous page
  if(offset !== 0) {
    headerValues.push( '<' + root + '?' + limitKey + '=' + (total < limit ? total : limit)  + '&' + offsetKey + '=' + Math.max(0,(offset-limit)) + '>; rel="prev"');
  }

  // Last page
  if(total % limit !== 0) {
    headerValues.push( '<' + root + '?' + limitKey + '=' + (total % limit) + '&' + offsetKey + '=' + (Math.floor(total / limit) * limit) + '>; rel="last"');  
  } else {
    headerValues.push( '<' + root + '?' + limitKey + '=' + ((total % limit) + limit)  + '&' + offsetKey + '=' + ((Math.floor(total / limit) * limit) - limit)+ '>; rel="last"');
  }

  return headerValues.join(',\n');
 	
}



module.exports = function(options) {

	_options.root = options.root || _options.root;
	_options.limitKey = options.limitKey || _options.limitKey;
	_options.offsetKey = options.offsetKey || _options.offsetKey;		


	return {
		sync : process,
		async : function(total, limit, offset, root, cb) {
			var header = process(total, limit, offset, root);
			cb(null, header);
		} 
	}
}