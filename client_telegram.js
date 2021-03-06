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

var responseTo = function(msg) {
	
	//console.dir(msg);
	
	var session = app.mdl('session').load(__service_uid, msg.from.id);
	
	var parsed = app.mdl('translator').parse(msg.text, {
		service : __service_uid,
		profile : msg.from.id,
	});
	
	app.mdl('logic_client').eval(parsed, function(error, level, result){
		
		/*
		if(error) {
			app.log.error(error);
		} else {
			app.log.info(result, '.....', level + '%');
		}
		*/
		
	}, function(error, result){
		
		if(error) {
			
			app.log.error(error);
			
		} else {
			
			//result = JSON.parse(result);
			
			switch(parsed.command) {
				
				case 'help' :
				case 'start' : {
					
					var resp_text = result;
					
					bot.sendMessage(msg.chat.id, resp_text, {
						//reply_to_message_id : msg.message_id,
						
						reply_markup : JSON.stringify({
							keyboard: [
								['/help', '/ping'],
								['/actions', '/companies'],
							],
						}),
						
						/*
						reply_markup : {
							inline_keyboard : [
								[
									{
										text : 'Акция 1',
										callback_data : '/action 1',
									},
								],
								[
									{
										text : 'Компания 2',
										callback_data : '/company 2',
									},
								],
							],
						},
						*/
					});
					
					app.mdl('session').set(parsed.meta.service, parsed.meta.profile, 'state', null);
					
				}
				break;
				
				case 'action' : {
					
					var resp_text = '';
					
					if(result.response && result.response.actions && result.response.actions.length) {
						
						result.response.actions.forEach(function(item, i ,arr){
							
							resp_text = resp_text + item.title + '\n';
							
						});
						
					} else {
						
						resp_text = resp_text + '\nНичего не найдено\n';
						
						//inline_keyboard = null;
						
					}
					
					bot.sendMessage(msg.chat.id, resp_text, {
						//reply_to_message_id : msg.message_id,
						//reply_markup : (inline_keyboard.length ? {
						//	inline_keyboard : inline_keyboard,
						//} : {}),
					});
					
					app.mdl('session').set(parsed.meta.service, parsed.meta.profile, 'state', null);
					
				}
				break;
				
				case 'actions' : {
					
					var resp_text = '';
					var inline_keyboard = [];
					
					if(result.response && result.response.actions && result.response.actions.length) {
						
						resp_text = resp_text + '\nМы подобрали наиболее актуальные акции:\n';
						
						result.response.actions.forEach(function(item, i ,arr){
							
							//resp_text = resp_text + item.title + '\n';
							
							inline_keyboard.push([{
								text : item.title,
								callback_data : '/action ' + item.id,
							}]);
							
						});
						
					} else {
						
						resp_text = resp_text + '\nНичего не найдено\n';
						
						//inline_keyboard = null;
						
					}
					
					bot.sendMessage(msg.chat.id, resp_text, {
						//reply_to_message_id : msg.message_id,
						//keyboard: null,
						reply_markup : (inline_keyboard.length ? {
							inline_keyboard : inline_keyboard,
						} : {}),
					});
					
					app.mdl('session').set(parsed.meta.service, parsed.meta.profile, 'state', null);
					
				}
				break;
				
				case 'company' : {
					
					var resp_text = '';
					
					if(result.response && result.response.companies && result.response.companies.length) {
						
						result.response.companies.forEach(function(item, i ,arr){
							
							resp_text = resp_text + item.title + '\n';
							
						});
						
					} else {
						
						resp_text = resp_text + '\nНичего не найдено\n';
						
						//inline_keyboard = null;
						
					}
					
					bot.sendMessage(msg.chat.id, resp_text, {
						//reply_to_message_id : msg.message_id,
						//reply_markup : (inline_keyboard.length ? {
						//	inline_keyboard : inline_keyboard,
						//} : {}),
					});
					
					app.mdl('session').set(parsed.meta.service, parsed.meta.profile, 'state', null);
					
				}
				break;
				
				case 'companies' : {
					
					var resp_text = '';
					var inline_keyboard = [];
					
					if(result.response && result.response.companies && result.response.companies.length) {
						
						resp_text = resp_text + '\nНайдено в организациях:\n';
						
						result.response.companies.forEach(function(item, i ,arr){
							
							//resp_text = resp_text + item.title + '\n';
							
							inline_keyboard.push([{
								text : item.title,
								callback_data : '/company ' + item.id,
							}]);
							
						});
						
					} else {
						
						resp_text = resp_text + '\nНичего не найдено\n';
						
					}
					
					bot.sendMessage(msg.chat.id, resp_text, {
						//reply_to_message_id : msg.message_id,
						//keyboard: null,
						reply_markup : (inline_keyboard.length ? {
							inline_keyboard : inline_keyboard,
						} : {}),
					});
					
					app.mdl('session').set(parsed.meta.service, parsed.meta.profile, 'state', null);
					
				}
				break;
				
				case 'ping' : {
					
					var resp_text = '';
					
					if(result.response.text == 'pong') {
						
						resp_text = resp_text + 'Сервер отвечает, все в порядке.' + '\n';
						
					} else {
						
						resp_text = resp_text + 'Вернулся странный ответ: ' + result.response.text + '\n';
						
					}
					
					bot.sendMessage(msg.chat.id, resp_text, {
						//reply_to_message_id : msg.message_id,
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
	
};

bot.on('message', responseTo);

bot.on('callback_query', function onCallbackQuery(callbackQuery) {
	
	responseTo({
		from : callbackQuery.from,
		chat : callbackQuery.message.chat,
		text : callbackQuery.data,
		message_id : 0,//callbackQuery.message.reply_to_message.message_id,
	})
	
});




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
		],
		"sticker" : {
			
		}
	}
	
	
	
	
	
	bot.sendMessage(msg.chat.id, 'Reply to ' + msg.message_id + ': ' + msg.text, {
		reply_to_message_id : msg.message_id,
	});
	
	bot.on('callback_query', function onCallbackQuery(callbackQuery) {
	  const action = callbackQuery.data;
	  const msg = callbackQuery.message;
	  const opts = {
		chat_id: msg.chat.id,
		message_id: msg.message_id,
	  };
	  let text;

	  if (action === 'edit') {
		text = 'Edited Text';
	  }

	  bot.editMessageText(text, opts);
	});

*/