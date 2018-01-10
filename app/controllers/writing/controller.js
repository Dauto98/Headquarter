const Writing = require('../../models/writing.js');

module.exports = {
	findAll : (req, res) => {
		Writing.find({}).exec().then((data) => res.json(data.map((doc) => ({html : doc.html, createdAt : doc.createdAt, updatedAt : doc.updatedAt, id : doc._id}))))
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
	},

	remove : (req, res) => {
		Writing.deleteMany({_id : req.params.id}).exec().then((data) => res.json(data)).catch(err => res.send(err)) 
	}
}
