const Writing = require("../../models/writing.js");

module.exports = {
	findAll : (req, res) => {
		Writing.find({type : req.params.type}).sort({createdAt : -1}).exec().then((data) => res.json({
			type : req.params.type,
			data : data.map((doc) => ({html : doc.html, createdAt : doc.createdAt, updatedAt : doc.updatedAt, id : doc._id, type : doc.type}))
		})).catch((err) => res.send(err));
	},

	findId : (req, res) => {
		Writing.findById(req.params.id).exec().then((data) => res.json(data)).catch((err) => res.send(err));
	},

	create : (req, res) => {
		var {html, type} = req.body;
		var newWriting = new Writing({html, type});
		newWriting.save((err) => {
			if (err) {
				res.send(err);
			} else {
				res.send("saved successfully");
			}
		});
	},

	update : (req, res) => {
		// if use .exec() mongoose will not wait for response from mongoDB
		Writing.update({_id : req.params.id}, {html : req.body.html}, (err) => {
			if (err) {
				res.send(err);
			} else {
				res.send("update successfully");
			}
		});
	},

	remove : (req, res) => {
		Writing.deleteMany({_id : req.params.id}).exec().then((data) => res.json(data)).catch(err => res.send(err));
	}
};
