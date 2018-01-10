"use strict";

import angular from 'angular';
import uirouter from '@uirouter/angularjs';
import journalComponent from './journal.component.js';

import writingService from '../../shares/writing.service.js';
import bindHtmlCompile from '../../shares/bindHtmlCompile.directive.js';

export default angular.module('journal', [uirouter, writingService.name, bindHtmlCompile.name]).config(["$stateProvider",
	($stateProvider) => {
		$stateProvider.state({
			name : 'journal',
			url : '/journal',
			component : 'journal'
		})
	}
]).component("journal", journalComponent);
