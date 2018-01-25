"use strict";

import template from './writing.template.html';
import style from './writing.template.css';
import $ from 'jquery';

import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default {
	template : function () {
		var $template = $(template);
		Object.keys(style).map((className) => $template.find("." + className).addBack("." + className).addClass(style[className]).removeClass(className))
		return Array.from($template).reduce((acc, sub) => acc + (sub instanceof Comment ? "" : (sub.outerHTML || sub.nodeValue || "")), "");
	},
	controller : ["writingService", "$scope",
		function writingController(writingService, $scope) {
			var self = this, currentEditingId;

			this.subnavState = 'list';
			this.writingType = 'journal'
			getAllWriting('journal');

			/**
			 * change the type of writing
			 * @param  {String} state name of the type
			 * @return {None}
			 */
			this.changeType = (type) => {
				currentEditingId = null;
				this.initContent = null;
				this.writingType = type;
				this.subnavState = 'list';
				getAllWriting(type)
			}

			this.changeSubNav = (state) => {
				currentEditingId = null;
				this.initContent = null;
				this.subnavState = state;
				if (state == 'list') {
					getAllWriting(this.writingType)
				}
			}

			function getAllWriting(type) {
				writingService.getAllWriting(type).then((data) => {
					self.allWriting = data;
					$scope.$apply();
				})
			}

			this.onSummit = (delta, html) => {
				writingService.saveWriting(self.writingType, delta, html, currentEditingId).then((res) => {
					getAllWriting(this.writingType);
					this.subnavState = 'list';
				});
			}

			this.removeWriting = (id) => {
				writingService.remove(id, self.writingType).then((res) => {
					getAllWriting(self.writingType)
				})
			}

			this.editWriting = (id) => {
				writingService.getWritingById(id).then((data) => {
					currentEditingId = data._id;
					this.initContent = data.delta;
					this.subnavState = 'write';
					$scope.$apply()
				})
			}
		}
	]
}
