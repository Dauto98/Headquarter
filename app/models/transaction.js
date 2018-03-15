const mongoose = require("mongoose");

var transaction = mongoose.Schema({
	usedDate : Number,
	value : Number,
	description : String,
	type : String,
	category : {},
	state : {},
	metadata : {
		total : Number,
		categories : {},
		states : {}
	}
}, {timestamps : true});

module.exports = mongoose.model("transaction", transaction);
