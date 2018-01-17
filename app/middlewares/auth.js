const jwt = require('jsonwebtoken');
const fs = require('fs');

function getTokenFromHeader(req) {
	var header = req.get("Authorization");
	header = header.split(" ");
	if (header[0] == "Bearer") {
		return header[1]
	} else {
		return null;
	}
}

module.exports = function (req, res, next) {
	var token = getTokenFromHeader(req);
	if (!token) {
		res.status(403).end();
	} else {
		var pubKey = fs.readFileSync(__dirname + '/headquarter.pem');
		var verification = jwt.verify(token, pubKey, {
			audience : process.env.auth_audience,
			algorithms : ['RS256']
		}, (err, decoded) => {
			if (err) {
				console.log(err);
			} else {
				if (decoded.sub === process.env.master_id) {
					next();
				} else {
					res.status(403).end();
				}
			}
		})
	}
}
