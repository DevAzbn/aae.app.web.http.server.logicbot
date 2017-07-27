'use strict';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var 
	__service_uid = 'console'
;

var azbn = new require(__dirname + '/../../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module);


var os = require('os');
var argv = require('optimist').argv;

azbn.setMdl('config', require('./config/main'));

azbn.mdl('config').port.http = argv.httpport || azbn.mdl('config').port.http || 3000;
azbn.mdl('config').port.https = argv.httpsport || azbn.mdl('config').port.https || 3001;

process.stdin.setEncoding('utf8');
process.stdin.resume();

var session = app.mdl('session').load(__service_uid, os.platform());

process.stdin.on('data', function(msg){
	
	var parsed = app.mdl('translator').parse(msg, {
		service : __service_uid,
		profile : os.platform(),
	});
	
	app.mdl('session').set(parsed.meta.service, parsed.meta.profile, 'msg_' + azbn.now(), parsed);
	
	app.mdl('logic_client').eval(parsed, function(error, level, result){
		
		if(error) {
			app.log.error(error);
		} else {
			app.log.info(result, '.....', level + '%');
		}
		
	}, function(error, result){
		
		if(error) {
			app.log.error(error);
		} else {
			app.log.info(result);
		}
		
	});
	
});
