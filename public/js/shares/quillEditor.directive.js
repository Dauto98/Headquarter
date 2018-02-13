"use strict";

import angular from 'angular';

import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default angular.module("quill-editor-directive", []).directive("quillEditor", [
	function () {
		return {
			restrict : 'A',
			scope : {
				onSummit : '<',
				quillEditor : '<'
			},
			link : function (scope, element, attrs) {
				var quill = new Quill('#' + attrs.id, {
					theme : 'snow',
					placeholder: 'Compose an epic...',
					modules : {
						toolbar: [
							['bold', 'italic', 'underline', 'strike'],        // toggled buttons
						  ['blockquote', 'code-block'],

						  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
						  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
						  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
						  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
						  [{ 'direction': 'rtl' }],                         // text direction

						  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
						  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

						  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
						  [{ 'font': [] }],
						  [{ 'align': [] }],

							['image'],
							['link'],
						  ['clean'],

							['submit']
						]
					}
				})

				// init initial content if passed from the parent component
				if (scope.quillEditor) {
					quill.setContents(scope.quillEditor)
				};

				// add styling to custom quill button, don't want to have a separate css file for a shared directive
				$(".ql-submit").addClass("btn btn-default").text("Submit").css({
					border: "1px solid transparent",
					width : "60px",
					'background-color' : "#fff",
					'border-color' : "#ccc"
				});
				$(".ql-submit").parent().css({
					position : "absolute",
					right : '0px'
				})

				$(".ql-submit").on("click", (event) => {
					scope.onSummit(quill.getContents(), quill.root.innerHTML)
				})

				scope.$on("$destroy", () => {
					$(".ql-submit").off('click');
				})
			}
		}
	}
])
