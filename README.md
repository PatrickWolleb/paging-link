#  [![wercker status](https://app.wercker.com/status/1d1aa78e5079df1e98890b331dfdebb3/m "wercker status")](https://app.wercker.com/project/bykey/1d1aa78e5079df1e98890b331dfdebb3)

> Creates RESTful paging link object based on total, limit and offset


## Getting Started

Install the module with: `npm install paging-link`

## Examples

```javascript

var PagingLink = require('../lib/paging-link.js');

var paging = new PagingLink({
	root : 'http://localhost:8000/users',
	limitKey : 'limit',
	offsetKey : 'offset'
});


// Process plain data object sync 
var header = paging.process( total, limit, offset );

// Render as HTTP header value
var headerValue = paging.toHTTPHeader( header );

```


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com).


## License

Copyright (c) 2014 Patrick Wolleb  
Licensed under the MIT license.
