"use strict";

import angular from 'angular';
import uirouter from '@uirouter/angularjs';
import budgetComponent from './budget.component.js';

import budgetService from '../../shares/budget.service.js';

export default angular.module('budget', [uirouter, budgetService.name]).config(["$stateProvider",
	($stateProvider) => {
		$stateProvider.state({
			name : 'budget',
			url : '/budget',
			component : 'budget'
		})
	}
]).component("budget", budgetComponent);
