'use strict';

var __path_prefix = '../../../../';

var azbn = new require(__dirname + '/' + __path_prefix + '../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module);

var _data = azbn.mdl('process/child').parseCliData(process.argv);

//console.log(_data);

process.send({
	kill_child : 1,
	app_fork : 1,
	data : _data,
})