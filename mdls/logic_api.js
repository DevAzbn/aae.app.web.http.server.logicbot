'use strict';

var _ = function(app, p) {
	
	var azbn = app.azbn;
	
	var ctrl = {
		
		defaults : {
			
		},
		
		setDefaults : function(data) {
			
			if(data) {
				for(var i in data) {
					ctrl.defaults[i] = data[i];
				}
			}
			
			return ctrl.defaults;
			
		},
		
		req : function(method, data, cb) {
			
			var _data = {};
			
			for(var i in ctrl.defaults) {
				_data[i] = ctrl.defaults[i];
			}
			
			if(data) {
				for(var i in data) {
					_data[i] = data[i];
				}
			}
			
			var _href = 'http://localhost:' + azbn.mdl('config').port.http + '/api/v1/';
			
			_data.method = method;
			
			azbn.mdl('web/http').r('POST', _href, _data, function(error, response, body){
				
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