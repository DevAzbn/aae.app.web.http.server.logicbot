'use strict';

process.send({
	kill_child : 1,
	app_fork : 1,
	data : {
		text : 'pong',
	},
})