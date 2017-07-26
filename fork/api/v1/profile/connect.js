'use strict';

var __path_prefix = '../../../../../';

var azbn = new require(__dirname + '/' + __path_prefix + '../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module);

var _data = azbn.mdl('process/child').parseCliData(process.argv);

//console.log(_data);

/*
params:

service
profile
token[public]
token[secret]
*/

var __json_prefix = __path_prefix + 'data/';

var public_uid = _data.token.public;

var profile = app.loadJSON(__json_prefix + 'profiles/app/' + public_uid);

var response = {};

if(profile.token) {
	
	if(profile.token.secret == _data.token.secret) {
		
		profile.connected[_data.service] = {
			service : _data.service,
			profile : _data.profile,
			created_at : azbn.now(),
		};
		
		app.saveJSON(__json_prefix + 'profiles/app/' + public_uid, profile);
		
		app.mkDataDir(__json_prefix + 'profiles/connected/' + _data.service);
		
		var _connected = {
			service : _data.service,
			profile : _data.profile,
			connected : profile.token.public,
			created_at : azbn.now(),
		};
		
		app.saveJSON(__json_prefix + 'profiles/connected/' + _data.service + '/' + _data.profile, _connected);
		
		response = _connected;
		
	} else {
		
		response = {
			error : {
				text : 'secret token is wrong!',
			},
		};
		
	}
	
} else {
	
	response = {
		error : {
			text : 'public token not found!',
		},
	};
	
}

process.send({
	kill_child : 1,
	app_fork : 1,
	data : response,
});
