const Transaction = require("../../models/transaction.js");
const find = require('lodash/find');

module.exports = {
	getTransactions : (req, res) => {
		Transaction.find().sort({createdAt: 1}).exec().then((data) => res.json(data)).catch(err => console.log(err));
	},

	createTransaction : (req, res) => {
		var {usedDate, value, description, type, category, state} = req.body;
		Transaction.findOne().sort({createdAt: -1}).exec().then(data => {
			// update metadata object
			var metadata = (data && data.metadata) || {"total":0,"states":[{"name":"active","value":0},{"name":"inactive","value":0},{"name":"in-card","value":0}],"categories":[{"name":"nes","value":0},{"name":"saving","value":0},{"name":"edu","value":0},{"name":"play","value":0},{"name":"give","value":0}]}
			if (type == 'expense') {
				metadata.total -= value;
				metadata.categories = metadata.categories.map(item => {
					if (item.name == category) {
						item.value -= value;
					}
					return item;
				})
				metadata.states = metadata.states.map(item => {
					if (item.name == state) {
						item.value -= value;
					}
					return item;
				})
			} else if (type == 'gain') {
				metadata.total += value;
				Object.keys(category).map(key => {
					var temp = find(metadata.categories, {name : key});
					temp.value += category[key];
				});
				metadata.states = metadata.states.map(item => {
					if (item.name == state) {
						item.value += value;
					}
					return item;
				})
			} else if (type == 'changeState') {
				var temp1 = find(metadata.states, {name : state.from});
				temp1.value -= value;
				var temp2 = find(metadata.states, {name : state.to});
				temp2.value += value;
				category = undefined;
			} else if (type == 'changeCategory') {
				var temp1 = find(metadata.categories, {name : category.from});
				temp1.value -= value;
				var temp2 = find(metadata.categories, {name : category.to});
				temp2.value += value;
				state = undefined;
			};

			var newTransaction = new Transaction({usedDate, value, description, type, category, state, metadata});
			newTransaction.save((err, data) => {
				if (err) {
					res.send(err);
				} else {
					res.send("Saved successfully");
				}
			})
		})
	}
}
