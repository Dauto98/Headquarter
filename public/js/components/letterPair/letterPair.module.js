"use strict";

import angular from 'angular';
import uirouter from '@uirouter/angularjs';
import letterPairComponent from './letterPair.component.js';

export default angular.module('letterPair', [uirouter]).config(["$stateProvider",
	($stateProvider) => {
		$stateProvider.state({
			name : 'letterPair',
			url : '/letterPair',
			component : 'letterPair'
		})
	}
]).component("letterPair", journalComponent);
