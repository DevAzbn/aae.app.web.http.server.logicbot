'use strict';

var _ = function(app, p) {
	
	var azbn = app.azbn;
	
	var ctrl = {
		
		req : function(method, data, cb) {
			
			var _href = 'http://localhost:' + azbn.mdl('config').port.http + '/api/v1/';
			
			data.method = method;
			
			azbn.mdl('web/http').r('POST', _href, data, function(error, response, body){
				
				if(error) {
					
					cb(error);
					
				} else {
					
					cb(null, response, body);
					
				}
				
			});
			
		},
		
	};
	
	return ctrl;
	
};

module.exports = _;