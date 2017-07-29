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

var __db_config = app.loadJSON(__json_prefix + '../config/mysql');

azbn.mdl('db/mysql', __db_config).connect(function(err){
	
	if(err) {
		
		process.send({
			kill_child : 1,
			app_fork : 1,
			data : {
				error : err,
			},
		});
		
	} else {
		
		azbn.mdl('db/mysql').end();
		
		process.send({
			kill_child : 1,
			app_fork : 1,
			data : {
				state : 'connected',
			},
		});
		
	}
	
});



