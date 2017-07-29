'use strict';

var __path_prefix = '../../../../../';

var azbn = new require(__dirname + '/' + __path_prefix + '../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module);

var _data = azbn.mdl('process/child').parseCliData(process.argv);

//console.log(_data);

/*
params:

text
*/

var __json_prefix = __path_prefix + 'data/';

var __mysql = app.loadJSON(__json_prefix + '../config/mysql');

azbn.mdl('db/mysql', __mysql).connect(function(err_connect_0001){
	
	if(err_connect_0001) {
		
		process.send({
			kill_child : 1,
			app_fork : 1,
			data : {
				error : err_connect_0001,
			},
		});
		
	} else {
		
		azbn.mdl('db/mysql').query("" +
			"SELECT " +
				"*" +
			"FROM " +
				"`" + __mysql.t.action + "` " +
			"WHERE " +
				"1 " +
				"AND " +
				"(`" + __mysql.t.action + "`.title LIKE '%" + _data.text + "%') " +
			"ORDER BY " +
				"`" + __mysql.t.action + "`.id" +
			"", function(err_sql_0001, rows, fields) {
					
					azbn.mdl('db/mysql').end();
					
					if (err_sql_0001) {
						
						process.send({
							kill_child : 1,
							app_fork : 1,
							data : {
								error : err_sql_0001,
							},
						});
						
					} else if(rows.length == 0) {
						
						process.send({
							kill_child : 1,
							app_fork : 1,
							data : {
								companies : [],
							},
						});
						
					} else {
						
						var __result = [];
						
						for(var i = 0; i < rows.length; i++) {
							
							__result.push({
								title : rows[i].title,
							})
							
						}
						
						process.send({
							kill_child : 1,
							app_fork : 1,
							data : {
								companies : __result,
							},
						});
						
					}
					
		});
		
		/*
		process.send({
			kill_child : 1,
			app_fork : 1,
			data : {
				state : 'connected',
			},
		});
		*/
		
	}
	
});



