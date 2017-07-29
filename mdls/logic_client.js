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
				}
				break;
				
				case 'start' : {
					result = 'Здравствуйте! Представьтесь, пожалуйста';
				}
				break;
				
				case 'help' : {
					result = 'Помощь по работе с ботом';
				}
				break;
				
				case 'search' : {
					result_semi = 'Поиск ' + parsed.parsed[1];
					//result = 'Поиск ' + parsed.parsed[1] + ' закончен';
					result = '\n';
					cb_semi(error_semi, 0, result_semi);

					app.mdl('logic_api').req('search/companies', {
						text : parsed.parsed[1],
					}, function(error, resp, body){
						
						if(error) {
							
							cb_final(error, body);
							
						} else {
							
							var _data = JSON.parse(body);
							
							if(_data.response.companies.length) {
								
								result = 'Найдено:';

								for(var i in _data.response.companies) {

									result = result + '\n' + _data.response.companies[i].title;

								}

							} else {

								result = 'Ничего не найдено';
								
							}

							//cb_final(null, _data);
							cb_final(null, result);
							
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
					process.exit(0);
				}
				break;
				
				default : {
					error = 'Неизвестная команда';
				}
				break;
				
			}
			
			cb_final(error, result);
			
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