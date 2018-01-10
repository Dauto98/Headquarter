const path = require('path');

module.exports = (app) => {
	//Api routes
	app.use('/api/writing', require('./controllers/writing/routes.js'));

	//Front end route
	app.get('*', (req, res) => {
		res.sendFile(path.resolve('./public/dist/index.html'));
	});
}
