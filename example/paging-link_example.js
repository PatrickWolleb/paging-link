'use strict';


// Root is your scheme, host and colletion 
// limitKey - defaults to "limit"
// offsetKey - defaults to "offset" 
var paging = require('../lib/paging-link.js')({
	root : 'http://localhost:8000/users',
});


var total = 34,
		limit = 10,
		offset = 10;


console.info('-------------------------------------------------------------------------------')
console.info('Request 	http://localhost:8000/users?limit=' + limit + '&offset=' + offset);
console.info('total	 	'+ total);		
console.info('-------------------------------------------------------------------------------')




// Sync 
var header = paging.sync( total, limit, offset );
console.info('=> Sync')
console.log(header)



// Async 
paging.async( total, limit, offset, null, function(err, header) {
	console.info('=> Async')
	console.log(header)
});


/* =>
<http://localhost:8000/users?limit=10&offset=20>; rel="next",
<http://localhost:8000/users?limit=10&offset=0>; rel="prev",
<http://localhost:8000/users?limit=4&offset=30>; rel="last"
*/ 