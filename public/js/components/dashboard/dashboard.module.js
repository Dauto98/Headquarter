"use strict";

import angular from 'angular';
import uirouter from '@uirouter/angularjs';
import dashboardComponent from './dashboard.component.js';

export default angular.module('dashboard', [uirouter]).config(["$stateProvider",
	($stateProvider) => {
		$stateProvider.state({
			name : 'dashboard',
			url : '/dashboard',
			component : 'dashboard'
		})
	}
]).component("dashboard", dashboardComponent);
