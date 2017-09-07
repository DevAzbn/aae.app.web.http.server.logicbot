'use strict';

var _ = function(app, p) {
	
	var azbn = app.azbn;
	
	var ctrl = {
		
		eval : function(parsed, cb_semi, cb_final) {
			
			var
				error = null,
				error_semi = null,
				result = null,
				result_semi = null
			;
			
			switch(parsed.command) {
				
				case null : {
					
					result = 'Сообщение без команды';
					
					cb_final(null, result);
					
				}
				break;
				
				case 'help' :
				case 'start' : {
					
					result = '' +
						'Здравствуйте!\n\n' +
						'Краткая справка по работе с ботом:\n' +
						'/start или /help - эта справка\n' +
						'/actions - список актуальных акций\n' +
						'/action <номер> - подробно о акции под номером\n' +
						'/search <название> - поиск организации по названию\n' +
						'/comp <номер> - просмотр данных о компании под номером\n' +
						'/ping - проверка связи\n' +
						//'\n' +
						''
					;
					
					cb_final(null, result);
					
				}
				break;
				
				case 'action' :
				case 'comp' :
				case 'ping' : {
					
					app.mdl('logic_api').req('ping', {
						
					}, function(error, resp, body){
						
						if(error) {
							
							cb_final(error, body);
							
						} else {
							
							var _data = JSON.parse(body);
							
							cb_final(null, _data);
							
						}
						
					});
					
				}
				break;
				
				case 'actions' : {
					
					app.mdl('logic_api').req('search/actions', {
						//text : parsed.parsed[1],
					}, function(error, resp, body){
						
						if(error) {
							
							cb_final(error, body);
							
						} else {
							
							var _data = JSON.parse(body);
							
							if(_data.response.actions && _data.response.actions.length) {
								
								cb_final(null, _data);
								
							} else {
								
								cb_final(null, []);
								
							}
							
						}
						
					});
					
				}
				break;
				
				case 'search' : {
					//result_semi = 'Поиск ' + parsed.parsed[1];
					////result = 'Поиск ' + parsed.parsed[1] + ' закончен';
					//result = '\n';
					//cb_semi(error_semi, 0, result_semi);
					
					app.mdl('logic_api').req('search/companies', {
						text : parsed.parsed[1],
					}, function(error, resp, body){
						
						if(error) {
							
							cb_final(error, body);
							
						} else {
							
							var _data = JSON.parse(body);
							
							if(_data.response.companies && _data.response.companies.length) {
								
								cb_final(null, _data);
								
							} else {
								
								cb_final(null, []);
								
							}
							
						}
						
					});
					
				}
				break;
				
				case 'api' : {
					
					app.mdl('logic_api').req('default', {
						profile : 'test0001',
					}, function(error, resp, body){
						
						if(error) {
							
							cb_final(error, body);
							
						} else {
							
							var _data = JSON.parse(body);
							
							cb_final(null, _data);
							
						}
						
					});
					
				}
				break;
				
				case 'exit' : {
					
					//cb_final(null, null);
					
					process.exit(0);
					
				}
				break;
				
				default : {
					
					//error = 'Неизвестная команда';
					//cb_final(error, null);
					
					cb_final(null, null);
					
				}
				break;
				
			}
			
			//cb_final(error, result);
			
		},
		
	};
	
	return ctrl;
	
};

module.exports = _;

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