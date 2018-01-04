"use strict";

import angular from 'angular';
import uirouter from '@uirouter/angularjs';
import navigatorComponent from './navigator.component.js';

export default angular.module('navigator', [uirouter]).component("navigator", navigatorComponent);
