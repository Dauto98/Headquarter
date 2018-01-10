"use strict";

import template from './letterPair.template.html';
import style from './letterPair.template.css';
import $ from 'jquery';

import letterPair from './letterPair.json';
import sample from 'lodash/sample';

export default {
	template : function () {
		var $template = $(template);
		Object.keys(style).map((className) => $template.find("." + className).addBack("." + className).addClass(style[className]).removeClass(className))
		return Array.from($template).reduce((acc, sub) => acc + (sub instanceof Comment ? "" : (sub.outerHTML || sub.nodeValue || "")), "");
	},
	controller : ["$timeout",
		function letterPairController($timeout) {
			var self = this;

			this.exercice = 'word-in-1-set';
			this.show = false;
			var letterSet, index, prefixLetter, letterSetKeys;

			this.chooseSet = (isRandom) => {
				if (isRandom === 'random') {
					prefixLetter = sample(Object.keys(letterPair))
					letterSet = letterPair[prefixLetter];
					letterSetKeys = Object.keys(letterSet)
					index = 0;
					this.results = [];
					$timeout(() => {
						document.querySelector(".word-in-1-set-input").focus()
					})
					showQuestion(letterSet, index)
				} else {
					prefixLetter = this.choosenSet.toUpperCase();
					if (prefixLetter && letterPair[prefixLetter]) {
						letterSet = letterPair[prefixLetter];
						letterSetKeys = Object.keys(letterSet);
						index = 0;
						this.results = [];
						$timeout(() => {
							document.querySelector(".word-in-1-set-input").focus()
						})
						showQuestion(letterSet, index);
					} else {
						this.error = "no such word"
					}
				}
			}

			function showQuestion(set, index) {
				self.show = true;
				self.letter = prefixLetter + letterSetKeys[index]
			}

			this.submitAnswer = (answer, event) => {
				if (checkAnswer(answer, letterSet, index)) {
					addResult(true, letterSet, index);
					index < 22 ? index++ : index;
					showQuestion(letterSet, index);
				} else {
					addResult(false, letterSet, index);
					index < 22 ? index++ : index;
					showQuestion(letterSet, index);
				}
				event.target.value = ''
			}

			function checkAnswer(word = "", set, index) {
				return set[letterSetKeys[index]] == word.toLowerCase()
			}

			function addResult(result, set, index) {
				var newResult = {
					correct : result,
					letter : prefixLetter + letterSetKeys[index],
					word : set[letterSetKeys[index]]
				}
				self.results.push(newResult);
				$timeout(() => {
					var elem = document.getElementById('word-in-1-set-result');
				  elem.scrollTop = elem.scrollHeight;
				})
			}
		}
	]
}
