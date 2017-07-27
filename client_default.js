'use strict';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var azbn = new require(__dirname + '/../../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module);



var argv = require('optimist').argv;

azbn.setMdl('config', require('./config/main'));

azbn.mdl('config').port.http = argv.httpport || azbn.mdl('config').port.http || 3000;
azbn.mdl('config').port.https = argv.httpsport || azbn.mdl('config').port.https || 3001;

process.stdin.setEncoding('utf8');
process.stdin.resume();

process.stdin.on('data', function(msg){
	
	msg = msg.trim();
	
	var msg_arr = msg.split(' ');
	
	console.log(msg_arr);
	
	if(msg.indexOf('/') == 0) {
		switch(msg_arr[0]) {
			
			case '/hello' : {
				app.log.info('Ohhh! Hi! How are you?');
			}
			break;
			
			default : {
				app.log.error('Неизвестная команда');
			}
			break;
			
		}
	}
	
});

/*
app.mdl('logic_api').req('profile/create', {
	service : 'test',
	profile : 'test0001',
}, function(error, resp, body){
	
	if(error) {
		
		app.log.error(error);
		
	} else {
		
		var _data = JSON.parse(body);
		
		if(_data.response && _data.response.token) {
			
			app.log.info('Публичный токен:', _data.response.token.public);
			
			app.mdl('logic_api').req('profile/connect', {
				service : 'test2',
				profile : 'test0002',
				token : {
					public : _data.response.token.public,
					secret : _data.response.token.secret,
				}
			}, function(_error, _resp, _body){
				
				if(_error) {
					
					app.log.error(_error);
					
				} else {
					
					var __data = JSON.parse(_body);
					
					if(__data.response.connected && __data.response.connected == _data.response.token.public) {
						
						app.log.info('Все ОК. Токены совпадают. Аккаунт подключен');
						
					} else if(__data.response.error) {
						
						app.log.error(__data.response.error.text);
						
					} else {
						
						app.log.info('Что-то пошло не так! ', __data);
						
					}
					
				}
				
			});
			
		}
		
	}
	
});
*/