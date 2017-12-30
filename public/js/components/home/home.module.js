"use strict";

import angular from 'angular';
import uirouter from '@uirouter/angularjs';
import homeComponent from './home.component.js';

export default angular.module('home', [uirouter]).config(["$stateProvider",
	($stateProvider) => {
		$stateProvider.state({
			name : 'home',
			url : '/',
			component : 'home'
		})
	}
]).component("home", homeComponent);
