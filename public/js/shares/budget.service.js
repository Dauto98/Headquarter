"use strict";

import angular from 'angular';
import testData from './budget.json';
import pick from 'lodash/pick';

export default angular.module("budget.service", []).service("budgetService", [
	function () {
		var service = {}, transactions;

		/**
		 * get all the data needed for overview tab
		 * @return {Object} data object
		 */
		service.getOverview = () => {
			let data = getTransactions();
			let overviewData = data[data.length - 1].metadata;
			overviewData.categories = overviewData.categories.map((category) => {
				return {
					name : category.name,
					value : category.value,
					transactions : data.filter((transaction) => transaction.category === category.name).map((item) => pick(item, ["value", "type", "usedDate", "category", "state", "description", "_id"]))
				}
			});
			return angular.copy(overviewData);
		}

		/**
		 * get all the data needed for all transactions tab
		 * @return {Object} data object
		 */
		service.getAllTransaction = () => {
			// lodash omit is consider slower than pick
			let data = getTransactions();
			return data.map((item) => pick(item, ["value", "type", "usedDate", "category", "state", "description", "_id"]));
		}

		/**
		 * in charge of supply transaction data for other function, either from variable, localStorage or server
		 * @return {Array} transactions array
		 */
		function getTransactions() {
			if (transactions && transactions.length > 0) {
				return transactions;
			} else {
				transactions = testData;
				return transactions;
			}
		}

		return service;
	}
])
