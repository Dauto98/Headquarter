const path = require('path');
const authMiddleware = require("./middlewares/auth.js");

module.exports = (app) => {
	//Api routes
	app.use('/api/writing', authMiddleware, require('./controllers/writing/routes.js'));

	app.use('/api/budget', authMiddleware, require('./controllers/budget/routes.js'));

	//Front end route
	app.get('*', (req, res) => {
		res.sendFile(path.resolve('./public/dist/index.html'));
	});
}
