"use strict";

import angular from 'angular';
import uirouter from '@uirouter/angularjs';
import journalComponent from './journal.component.js';

export default angular.module('journal', [uirouter]).config(["$stateProvider",
	($stateProvider) => {
		$stateProvider.state({
			name : 'journal',
			url : '/journal',
			component : 'journal'
		})
	}
]).component("journal", journalComponent);
