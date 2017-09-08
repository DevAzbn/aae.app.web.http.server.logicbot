'use strict';

var _ = function(app, p) {
	
	var azbn = app.azbn;
	
	var ctrl = {
		
		parse : function(str, meta) {
			
			var result = {};
			
			var _str = (str || '').trim();
			
			var _str_arr = _str.split(' ');
			
			for(var i = 0; i < _str_arr.length; i++) {
				_str_arr[i] = _str_arr[i].trim();
			}
			
			result = {
				meta : meta,
				text : str,
				parsed : _str_arr,
				command : (_str_arr[0].indexOf('/') == 0) ? _str_arr[0].substr(1, _str_arr[0].length - 1) : null,
			}
			
			return result;
			
		},
		
	};
	
	return ctrl;
	
};

module.exports = _;