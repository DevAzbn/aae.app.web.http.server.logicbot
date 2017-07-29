'use strict';

function _(app, azbn) {
	
	app.log.info(__filename);
	
	return function(req, res) {
		
		var method = req.body.method || 'default';
		
		//res.send(req.body);
		
		var service_config = app.loadJSON('services/' + req.body.access_as);
		
		if(req.body.access_token && req.body.access_token !='' && service_config.access_token == req.body.access_token) {
			
			app.fork('api/v1/' + method, req.body, function(_process, _msg){
				
				//console.log(_msg);
				
				if(_msg.kill_child == 0) {
					_process.kill();
				}
				
				res.send({
					meta : {
						version : 1,
						version_api : 1.2,
						created_at : azbn.now(),
						created_at_str : '',
						platform : 'AAE',
						access : {
							access_as : 'service',
							id : req.body.access_as,
						},
						msg : {
							type : 'info',
							text : '',
						},
						need : {
							reload : 0,
						},
						notifies : [],
					},
					response : _msg.data,
					/*
					response : {
						params : req.params,//from url
						query : req.query,//_get
						body : req.body,//_post
						msg : _msg,//from fork
					},
					*/
				});
				
			});
			
		} else {
			
			res
				.status(403)
				.send({
					response : {
						error : {
							code : 403,
							text : 'access_token is wrong',
						},
					},
				})
			;
			
		}
		
	};
}

module.exports = _;