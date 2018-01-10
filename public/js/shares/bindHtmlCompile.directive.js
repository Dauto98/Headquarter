"use strict";

import angular from 'angular';

export default angular.module("bindHtmlCompile.directive", []).directive('bindHtmlCompile', ['$compile',
	function ($compile) {
	  return function(scope, element, attrs) {
	    scope.$watch(
	      function(scope) {
	        // watch the 'compile' expression for changes
	        return scope.$eval(attrs.bindHtmlCompile);
	      },
	      function(value) {
	        // when the 'compile' expression changes
	        // assign it into the current DOM
	        element.html(value);

	        // compile the new DOM and link it to the current
	        // scope.
	        // NOTE: we only compile .childNodes so that
	        // we don't get into infinite loop compiling ourselves
	        $compile(element.contents())(scope);
	      }
	    );
	  };
	}
])
