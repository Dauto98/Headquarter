"use strict";

import angular from 'angular';
import pick from 'lodash/pick';

export default angular.module("budget.service", []).service("budgetService", ["authService",
	function (authService) {
		var service = {}, transactions;

		/**
		 * get all the data needed for overview tab
		 * @return {Object} data object
		 */
		service.getOverview = () => {
			return getTransactions().then(data => {
				let overviewData = data[data.length - 1].metadata;
				overviewData.categories = overviewData.categories.map((category) => {
					return {
						name : category.name,
						value : category.value,
						transactions : data.filter((transaction) => transaction.category === category.name).map((item) => pick(item, ["value", "type", "usedDate", "category", "state", "description", "_id"]))
					}
				});
				return angular.copy(overviewData);
			});
		}

		/**
		 * get all the data needed for all transactions tab
		 * @return {Object} data object
		 */
		service.getAllTransaction = () => {
			// lodash omit is consider slower than pick
			return getTransactions().then(data => data.map((item) => pick(item, ["value", "type", "usedDate", "category", "state", "description", "_id"])));
		}

		/**
		 * in charge of supply transaction data for other function, either from variable, localStorage or server
		 * @return {Array} transactions array
		 */
		function getTransactions(from, to) {
			if (transactions && transactions.length > 0) {
				return Promise.resolve(transactions);
			} else {
				return fetch(process.env.API_URL + `budget`, {
					headers : {
						"Authorization" : `Bearer ${authService.getAccessToken()}`
					}
				}).then((res) => res.json()).then(data => {
					transactions = data;
					return data;
				}).catch((err) => console.log(err))
				return transactions;
			}
		}
		
		service.createNewTransaction = ({usedDate = null, value = null, description = null, type = null, category = null, state = null}) => {
			if (usedDate == null || value == null || description == null || type == null || category == null || state == null) {
				return Promise.reject("Error: missing fields")
			}
			if (type == 'gain') {
				if (Object.values(category).reduce((acc, sub) => acc += sub, 0) !== value) {
					return Promise.reject("Error: the value and category field doesn't match")
				}
			}
			return fetch(process.env.API_URL + `budget/create`, {
				method: 'post',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json',
					"Authorization" : `Bearer ${authService.getAccessToken()}`
				},
				body: JSON.stringify({usedDate, value, description, type, category, state})
			}).then((res) => transactions = null);
		}

		return service;
	}
])
