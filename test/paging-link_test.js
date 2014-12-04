/*global describe,it*/
'use strict';
var assert = require('assert'),
  PagingLink = require('../lib/paging-link.js'),
  pagingLink;


// Expose options for testing only
Object.defineProperty( PagingLink.prototype, 'options', {
	get : function() {
		return this._options;
	}
});



describe('paging-link node module.', function() {
	
	
	describe('constructor method', function() {
		
	  it('should resolve to default values when no options passed', function() {
	    
	  	pagingLink = new PagingLink();

	  	var options = pagingLink.options;

	  	assert(options.limitKey, 'limit');
	  	assert(options.offsetKey, 'offset');
	  	assert.equal(options.root, null);

	  });


	  it('should accept passed options', function() {
	   	
	  	var mockOptions = {
	  		limitKey : 'hello',
	  		offsetKey : 'world',
	  		root: 'http://localhost:8000/users'
	  	}; 

	  	pagingLink = new PagingLink(mockOptions);

	  	var options = pagingLink.options;
	  	
	  	assert(options.limitKey, mockOptions.limitKey);
	  	assert(options.offsetKey, mockOptions.offsetKey);
	  	assert.equal(options.root, mockOptions.root);

	  });
	
	});


	describe('process method', function() {
		
		it('should return correct model signature', function() {
	    
	  	pagingLink = new PagingLink({});

	  	var result = pagingLink.process( 200, 20, 20 );
	  	assert.equal( typeof result.prev, 'object' );	
	  	assert.equal( typeof result.next, 'object' );	
	  	assert.equal( typeof result.last, 'object' );	
	  
	  	assert.equal( typeof result.prev.offset, 'number' );	
	  	assert.equal( typeof result.prev.limit, 'number' );	
	  	assert.equal( typeof result.next.offset, 'number' );	
	  	assert.equal( typeof result.next.limit, 'number' );	
	  	assert.equal( typeof result.last.offset, 'number' );	
	  	assert.equal( typeof result.last.limit, 'number' );	

	  });


	  it('should return no prev page when on first page', function() {
	    
	  	pagingLink = new PagingLink({});

	  	var result = pagingLink.process( 200, 20, 0 );
	  	assert.equal( result.prev , undefined);	

	  });


	  it('should calculate next values correctly', function() {
	    
	  	pagingLink = new PagingLink({});


	  	var result = pagingLink.process( 200, 20, 0 );
	  	assert.equal( result.next.offset , 20);	
	  	assert.equal( result.next.limit , 20);	


	  	result = pagingLink.process( 79, 20, 60 );
	  	assert.equal( result.next , undefined);	
	  	
	  	result = pagingLink.process( 100, 20, 60 );
	  	assert.equal( result.next.offset , 80);	
	  	assert.equal( result.next.limit , 20);


	  	result = pagingLink.process( 100, 16, 32 );
	  	assert.equal( result.next.offset , 48);	
	  	assert.equal( result.next.limit , 16);	

	  });


	  it('should calculate prev values correctly', function() {
	    
	  	pagingLink = new PagingLink({});


	  	var result = pagingLink.process( 200, 20, 20 );
	  	assert.equal( result.prev.offset , 0);	
	  	assert.equal( result.prev.limit , 20);	


	  	result = pagingLink.process( 100, 20, 0 );
	  	assert.equal( result.prev , undefined);	
	  	
	  	result = pagingLink.process( 100, 20, 60 );
	  	assert.equal( result.prev.offset , 40);	
	  	assert.equal( result.prev.limit , 20);

	  	result = pagingLink.process( 40, 20, 20 );
	  	assert.equal( result.prev.offset , 0);	
	  	assert.equal( result.prev.limit , 20);


	  });


	   it('should calculate last values correctly', function() {
	    
	  	pagingLink = new PagingLink({});


	  	var result = pagingLink.process( 200, 20, 20 );
	  	assert.equal( result.last.offset , 180);	
	  	assert.equal( result.last.limit , 20);	
	  	
	  	result = pagingLink.process( 102, 20, 60 );
	  	assert.equal( result.last.offset , 100);	
	  	assert.equal( result.last.limit , 2);

	  	result = pagingLink.process( 5, 20, 20 );
	  	assert.equal( result.last.offset , 0);	
	  	assert.equal( result.last.limit , 5);


	  });
	
	});


	describe('toHTTPHeader method', function() {
		
	  it('should render model comma sperated', function() {
	    
	  	pagingLink = new PagingLink();

	  	var mockData = {
	  		model : { 
	  			last: { limit: 4, offset: 30 },
  				next: { limit: 10, offset: 20 },
  				prev: { limit: 10, offset: 0 } 
  			},
  			total : 34
	  	};


	  	var header = pagingLink.toHTTPHeader(mockData.model);

	  	assert.equal(header.split(',').length, 3);

	  });


	  it('should render root into header', function() {
	    
	   	var mockOptions = {
	  		root: 'http://localhost:9000/collection'
	  	};

	  	var mockData = {
	  		model : { 
	  			last: { limit: 4, offset: 30 },
  				next: { limit: 10, offset: 20 },
  				prev: { limit: 10, offset: 0 } 
  			},
  			total : 34
	  	};

	  	pagingLink = new PagingLink(mockOptions);


	  	var headers = pagingLink.toHTTPHeader(mockData.model).split(',');

	  	assert.notEqual(headers[0].indexOf(mockOptions.root), -1);
	  	assert.notEqual(headers[1].indexOf(mockOptions.root), -1);
	  	assert.notEqual(headers[2].indexOf(mockOptions.root), -1);
	  });



	  it('should render limit and offsets into header', function() {
	    
	   	var mockOptions = {
	  		root: 'http://localhost:9000/collection'
	  	};

	  	var mockData = {
	  		model : { 
	  			last: { limit: 4, offset: 30 },
  				next: { limit: 10, offset: 20 },
  				prev: { limit: 10, offset: 0 } 
  			},
  			total : 34
	  	};

	  	pagingLink = new PagingLink(mockOptions);


	  	var headers = pagingLink.toHTTPHeader(mockData.model).split(',');

	  	var last = headers[0];
	  	assert.equal(last.substr(last.indexOf('limit=') + 6, 1) , 4 );
	  	assert.equal(last.substr(last.indexOf('offset=') + 7, 2) , 30);

	  	var next = headers[1];
	  	assert.equal(next.substr(next.indexOf('limit=') + 6, 2) , 10 );
	  	assert.equal(next.substr(next.indexOf('offset=') + 7, 2) , 20);

	  	var prev = headers[2];
	  	assert.equal(prev.substr(prev.indexOf('limit=') + 6, 2) , 10 );
	  	assert.equal(prev.substr(prev.indexOf('offset=') + 7, 1) , 0);
	  	
	  	
	  });




	  it('should render limitKey and offsetKey into header', function() {
	    
	   	var mockOptions = {
	  		root: 'http://localhost:9000/collection',
	  		limitKey : 'hello',
	  		offsetKey : 'world'
	  	};

	  	var mockData = {
	  		model : { 
	  			last: { limit: 4, offset: 30 },
  				next: { limit: 10, offset: 20 },
  				prev: { limit: 10, offset: 0 } 
  			},
  			total : 34
	  	};

	  	pagingLink = new PagingLink(mockOptions);


	  	var headers = pagingLink.toHTTPHeader(mockData.model).split(',');
	  	assert.notEqual(headers[0].indexOf(mockOptions.limitKey), -1);
	  	assert.notEqual(headers[0].indexOf(mockOptions.offsetKey), -1);

	  	assert.notEqual(headers[1].indexOf(mockOptions.limitKey), -1);
	  	assert.notEqual(headers[1].indexOf(mockOptions.offsetKey), -1);

	  	assert.notEqual(headers[2].indexOf(mockOptions.limitKey), -1);
	  	assert.notEqual(headers[2].indexOf(mockOptions.offsetKey), -1);
	  
	  });

	
	});

});
