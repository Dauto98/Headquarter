"use strict";

import angular from 'angular';
import uirouter from '@uirouter/angularjs';
import writingComponent from './writing.component.js';

import writingService from '../../shares/writing.service.js';
import bindHtmlCompile from '../../shares/bindHtmlCompile.directive.js';

export default angular.module('writing', [uirouter, writingService.name, bindHtmlCompile.name]).config(["$stateProvider",
	($stateProvider) => {
		$stateProvider.state({
			name : 'writing',
			url : '/writing',
			component : 'writing'
		})
	}
]).component("writing", writingComponent);
