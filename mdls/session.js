'use strict';

var _ = function(app, p) {
	
	var azbn = app.azbn;
	
	var ctrl = {
		
		load : function(service, profile, ttl) {
			
			app.mkDataDir('sessions/' + service);
			
			var sess = app.loadJSON('sessions/' + service + '/' + profile);
			
			if(sess.created_at) {
				
				if((sess.created_at + sess.ttl) > azbn.now()) {
					
				} else {
					
					sess = {
						created_at : null,
						ttl : null,
						data : {},
					};
					
				}
				
			} else {
				
				sess = {
					created_at : null,
					ttl : null,
					data : {},
				};
				
			}
			
			sess.created_at = azbn.now();
			sess.ttl = sess.ttl || ttl || (24 * 3600 * 1000);
			
			app.saveJSON('sessions/' + service + '/' + profile, sess);
			
			return sess;
			
		},
		
		set : function(service, profile, k, v) {
			
			var sess = app.loadJSON('sessions/' + service + '/' + profile);
			
			if(sess.data) {
				
				
				
			} else {
				
				sess = ctrl.load(service, profile);
				
			}
			
			sess.data[k] = v;
			
			app.saveJSON('sessions/' + service + '/' + profile, sess);
			
			return sess;
			
		},
		
		get : function(service, profile, k) {
			
			var sess = app.loadJSON('sessions/' + service + '/' + profile);
			
			if(sess.data) {
				
				if(typeof sess.data[k] != 'undefined') {
					
					return sess.data[k];
					
				} else {
					
					return null;
					
				}
				
			} else {
				
				return null;
				
			}
			
		},
		
	};
	
	return ctrl;
	
};

module.exports = _;