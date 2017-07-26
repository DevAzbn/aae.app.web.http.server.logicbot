/*
обработчик запроса
*/

function _(app, azbn) {
	
	azbn.mdl('express').set('views', azbn.mdl('config').path.pug);
	azbn.mdl('express').set('view engine', 'pug');
	
	azbn.mdl('express').get('/api/v1/', (new require('./api/v1')(app, azbn)));
	azbn.mdl('express').post('/api/v1/', (new require('./api/v1')(app, azbn)));
	//azbn.mdl('express').put('/', (new require('./route/event/item/put')(app, azbn)));
	//azbn.mdl('express').delete('/event/:year/:month/:day/', (new require('./route/event/item/delete')(app, azbn)));
	
	/*
	azbn.load('azbn-tple',  new require('azbn-tple')({
		part_path : azbn.mdl('cfg').path.app + '/azbn-tple',
		cache : {
			tpls : [
				'/index.azbn-tple',
			],
		},
	}));
	*/
	
	/*
	azbn.mdl('express').get('/event/:year/:month/:day/',				(new require('./route/event/item/get')(azbn)));
	azbn.mdl('express').post('/event/:year/:month/:day/',				(new require('./route/event/item/post')(azbn)));
	azbn.mdl('express').put('/event/:year/:month/:day/',				(new require('./route/event/item/put')(azbn)));
	azbn.mdl('express').delete('/event/:year/:month/:day/',				(new require('./route/event/item/delete')(azbn)));
	
	
	
	
	var NeDB = require('nedb');
	
	azbn.load('nedb.entity', new NeDB({filename : azbn.mdl('cfg').path.app + '/nedb/entity.nedb'}));
	azbn.mdl('nedb.entity').loadDatabase();
	azbn.mdl('nedb.entity').ensureIndex({fieldName : 'uid'});
	
	azbn.mdl('express').get('/entity/item/:uid/',					(new require('./route/entity/item/get')(azbn)));
	azbn.mdl('express').post('/entity/item/create/',				(new require('./route/entity/item/post')(azbn)));
	azbn.mdl('express').put('/entity/item/update/',					(new require('./route/entity/item/put')(azbn)));
	azbn.mdl('express').delete('/entity/item/delete/',				(new require('./route/entity/item/delete')(azbn)));
	
	azbn.mdl('express').get('/entity/list/',						(new require('./route/entity/list/get')(azbn)));
	
	azbn.mdl('express').get('/web/get/',						(new require('./route/web/get')(azbn)));
	
	azbn.mdl('express').get('/pug/index/',						(new require('./route/pug/index')(azbn)));
	
	azbn.mdl('express').get('/azbn-tple/index/',						(new require('./route/azbn-tple/index')(azbn)));
	azbn.mdl('express').get('/azbn-tple/version/',						(new require('./route/azbn-tple/version')(azbn)));
	*/
	
	/*
	azbn.mdl('express').get('/:uid/',					(new require('./route/entity/item/get')(azbn)));
	*/
	
}

module.exports = _;