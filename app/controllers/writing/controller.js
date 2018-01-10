const Writing = require('../../models/writing.js');

module.exports = {
	findAll : (req, res) => {
		Writing.find({}).exec().then((data) => res.json(data.map((doc) => ({html : doc.html, createdAt : doc.createdAt, updatedAt : doc.updatedAt}))))
	},

	create : (req, res) => {
		var {delta, html} = req.body;
		var newWriting = new Writing({delta, html})
		newWriting.save((err, data) => {
			if (err) {
				res.send(err)
			} else {
				res.send("saved sucessfully")
			}
		})
	}
}
