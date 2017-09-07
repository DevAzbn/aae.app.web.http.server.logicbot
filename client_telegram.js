'use strict';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var 
	__service_uid = 'telegram'
;

var azbn = new require(__dirname + '/../../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module);


var os = require('os');
var argv = require('optimist').argv;

azbn.setMdl('config', require('./config/main'));

azbn.mdl('config').port.http = argv.httpport || azbn.mdl('config').port.http || 3000;
azbn.mdl('config').port.https = argv.httpsport || azbn.mdl('config').port.https || 3001;

//process.stdin.setEncoding('utf8');
//process.stdin.resume();

var service_config = app.loadJSON('services/' + __service_uid);

app.mdl('logic_api').setDefaults({
	access_as : __service_uid,
	access_token : service_config.access_token,
})

var TelegramBotLib = require('node-telegram-bot-api');
var bot = new TelegramBotLib(service_config.auth.token, {
	polling: true,
});

bot.on('message', function(msg) {
	//msg.chat.id;
	// send a message to the chat acknowledging receipt of their message
	//bot.sendMessage(chatId, 'Received your message');
	//var session = app.mdl('session').load(__service_uid, os.platform());
	//console.dir(msg);
	/*
	{
		"message_id": 3,
		"from": {
			"id": 136573652,
			"is_bot": false,
			"first_name": "Alexander",
			"last_name": "Zybin",
			"username": "azbn_ru",
			"language_code": "ru-RU"
		},
		"chat": {
			"id": -45438138,
			"title": "AzbnBotChat",
			"type": "group",
			"all_members_are_administrators": true
		},
		"date": 1504776370,
		"text": "/test",
		"entities": [
			{
				"offset": 0,
				"length": 5,
				"type": "bot_command"
			}
		]
	}
	*/
	
	var session = app.mdl('session').load(__service_uid, msg.from.id);
	
	var parsed = app.mdl('translator').parse(msg.text, {
		service : __service_uid,
		profile : msg.from.id,
	});
	
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
			
			//result = JSON.parse(result);
			
			switch(parsed.command) {
				
				case 'search' : {
					
					var resp_text = '';
					
					if(result.response && result.response.companies && result.response.companies.length) {
						
						resp_text = resp_text + '\nНайдено в организациях:\n';
						
						result.response.companies.forEach(function(item, i ,arr){
							
							resp_text = resp_text + item.title + '\n';
							
						});
						
					} else {
						
						resp_text = resp_text + '\nНичего не найдено\n';
						
					}
					
					bot.sendMessage(msg.chat.id, resp_text, {
						reply_to_message_id : msg.message_id,
					});
					
					app.mdl('session').set(parsed.meta.service, parsed.meta.profile, 'state', null);
					
				}
				break;
				
				default : {
					
					//app.log.error('Неизвестная команда');
					
					app.mdl('session').set(parsed.meta.service, parsed.meta.profile, 'state', null);
					
				}
				break;
				
			}
			
		}
		
		//console.log(app.mdl('session').get(parsed.meta.service, parsed.meta.profile, _now));
		
	});
	
	/*
	bot.sendMessage(msg.chat.id, 'Reply to ' + msg.message_id + ': ' + msg.text, {
		reply_to_message_id : msg.message_id,
	});
	*/
	
});






/*
process.stdin.on('data', function(msg){
	
	var _now = 'msg_' + azbn.now();
	
	var parsed = app.mdl('translator').parse(msg, {
		service : __service_uid,
		profile : os.platform(),
	});
	
	app.mdl('session').set(parsed.meta.service, parsed.meta.profile, _now, parsed);
	
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
			
			//result = JSON.parse(result);
			
			switch(parsed.command) {
				
				case null : {
					
					app.log.error('Сообщение без команды');
					
					
					var _state = app.mdl('session').get(parsed.meta.service, parsed.meta.profile, 'state');
					
					if(_state) {
						
						switch(_state) {
							
							case 'search.waitForString' : {
								
								
								
								app.mdl('session').set(parsed.meta.service, parsed.meta.profile, 'state', null);
								
							}
							break;
							
							default : {
								
								app.mdl('session').set(parsed.meta.service, parsed.meta.profile, 'state', null);
								
							}
							break;
							
						}
						
					}
					
					
				}
				break;
				
				case 'ping' : {
					
					if(result.response.text == 'pong') {
						
						app.log.info('Сервер отвечает, все в порядке.');
						
					} else {
						
						app.log.info('Вернулся странный ответ:', result.response.text);
						
					}
					
					app.mdl('session').set(parsed.meta.service, parsed.meta.profile, 'state', null);
					
				}
				break;
				
				case 'search' : {
					
					if(result.response && result.response.companies && result.response.companies.length) {
						
						app.log.info('Найдено в организациях:');
						
						result.response.companies.forEach(function(item, i ,arr){
							console.log(item.title);
						});
						
					} else {
						
						app.log.warn('Ничего не найдено');
						
					}
					
					app.mdl('session').set(parsed.meta.service, parsed.meta.profile, 'state', null);
					
				}
				break;
				
				default : {
					
					app.log.error('Неизвестная команда');
					
					app.mdl('session').set(parsed.meta.service, parsed.meta.profile, 'state', null);
					
				}
				break;
				
			}
			
		}
		
		//console.log(app.mdl('session').get(parsed.meta.service, parsed.meta.profile, _now));
		
	});
	
});
*/