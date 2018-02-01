"use strict";

import angular from 'angular';
import testData from './budget.json';

export default angular.module("budget.service", []).service("budgetService", [
	function () {
		var service = {}

		service.getOverview = () => {
			return testData
		}

		service.getAllTransaction = () => {
			return testData.budgetCategory.map((category) => category.transactions).reduce((acc, sub) => acc = [...acc, ...sub], [])
		}

		return service;
	}
])
