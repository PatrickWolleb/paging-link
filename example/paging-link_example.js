'use strict';


// Root is your scheme, host and colletion 
// limitKey - defaults to "limit"
// offsetKey - defaults to "offset" 

var PagingLink = require('../lib/paging-link.js');

var total = 34,
		limit = 10,
		offset = 10;


console.info('-------------------------------------------------------------------------------')
console.info('Request 	http://localhost:8000/users?limit=' + limit + '&offset=' + offset);
console.info('total	 	'+ total);
console.info('limit	 	'+ limit);
console.info('offset 		'+ offset);		
console.info('-------------------------------------------------------------------------------')



// Instanciate
var paging = new PagingLink({
	root : 'http://localhost:8000/users',
	limitKey : 'limit',
	offsetKey : 'offset'
});



// Process plain data object sync 
var header = paging.process( total, limit, offset );
console.log(header)


// Render as HTTP header value
console.log( paging.toHTTPHeader( header ) );
