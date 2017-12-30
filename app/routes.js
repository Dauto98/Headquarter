const path = require('path');

module.exports = (app) => {
	//Front end route
	app.get('/', (req, res) => {
		res.sendFile(path.resolve('./public/dist/index.html'));
	});
}
