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
*/

var __json_prefix = __path_prefix + 'data/';

var public_uid = azbn.randstr().toUpperCase();

var profile = app.loadJSON(__json_prefix + 'profiles/app/' + public_uid);

if(profile.connected) {
	
} else {
	
	profile.connected = {};
	
}

profile.connected[_data.access_as] = {
	service : _data.access_as,
	profile : _data.profile,
	created_at : azbn.now(),
	/*
	token : {
		
	}
	*/
};

profile.token = {
	public : public_uid,
	secret : azbn.randstr().toUpperCase(),
}

app.saveJSON(__json_prefix + 'profiles/app/' + public_uid, profile);

app.mkDataDir(__json_prefix + 'profiles/connected/' + _data.access_as);

app.saveJSON(__json_prefix + 'profiles/connected/' + _data.access_as + '/' + _data.profile, {
	service : _data.access_as,
	profile : _data.profile,
	connected : profile.token.public,
	created_at : azbn.now(),
});

process.send({
	kill_child : 1,
	app_fork : 1,
	data : {
		service : _data.access_as,
		profile : _data.profile,
		token : profile.token,
	},
})