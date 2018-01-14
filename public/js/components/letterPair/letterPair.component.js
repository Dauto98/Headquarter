"use strict";

import template from './letterPair.template.html';
import style from './letterPair.template.css';
import $ from 'jquery';

import letterPair from './letterPair.json';
import sample from 'lodash/sample';
import sampleSize from 'lodash/sampleSize';
import chunk from 'lodash/chunk';
import flattenDeep from 'lodash/flattenDeep';
import shuffle from 'lodash/shuffle'

export default {
	template : function () {
		var $template = $(template);
		Object.keys(style).map((className) => $template.find("." + className).addBack("." + className).addClass(style[className]).removeClass(className))
		return Array.from($template).reduce((acc, sub) => acc + (sub instanceof Comment ? "" : (sub.outerHTML || sub.nodeValue || "")), "");
	},
	controller : ["$timeout",
		function letterPairController($timeout) {
			var self = this;

			this.exercise = 'word-in-1-set';

			/**************************************
				NOTE: EXERCISE: WORD IN 1 SET *
			 **************************************/

			this.show = false;
			var letterSet, index, prefixLetter, letterSetKeys, letterPairWithWords, exercise;

			this.chooseSet = (isRandom) => {
				exercise = "1 set";
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
				self.allRandomStep = null;
			}

			this.submitAnswer = (answer, event) => {
				if (exercise == 'all random') {
					if (checkAnswerAllRandom(answer, letterPairWithWords, self.letter)) {
						addResultAllRandom(true, self.letter, letterPairWithWords[self.letter])
						index < letterSet.length-1 ? index++ : index;
						showAllRandomQuestions(letterSet, index)
					} else {
						addResultAllRandom(false, self.letter, letterPairWithWords[self.letter])
						index < letterSet.length-1 ? index++ : index;
						showAllRandomQuestions(letterSet, index)
					}
				} else {
					if (checkAnswer(answer, letterSet, index)) {
						addResult(true, letterSet, index);
						index < 22 ? index++ : index;
						showQuestion(letterSet, index);
					} else {
						addResult(false, letterSet, index);
						index < 22 ? index++ : index;
						showQuestion(letterSet, index);
					}
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

			//NOTE: EXERCISE: ALL RANDOM
			this.startAllRandom = () => {
				exercise = "all random"
				var allLetterRandom = shuffle(getLetterPairArray());
				getLetterPairWithWords();
				letterSet = allLetterRandom
				index = 0;
				self.results = [];
				showAllRandomQuestions(allLetterRandom, index);
				$timeout(() => {
					document.querySelector(".word-in-1-set-input").focus()
				})
			}

			function showAllRandomQuestions(set, key) {
				self.show = true;
				self.letter = set[key];
				self.allRandomStep = `${key + 1}/${set.length} : `;
			}

			function getLetterPairWithWords() {
				if (!letterPairWithWords) {
					letterPairWithWords = {};
					var allLetter = getLetterPairArray();
					allLetter.map((letter) => {
						var [prefix, suffix] = letter.split("");
						letterPairWithWords[letter] = letterPair[prefix][suffix]
					})
				}
				return letterPairWithWords;
			}

			function checkAnswerAllRandom(answer = "", set, key) {
				return answer.toLowerCase() == set[key].toLowerCase()
			}

			function addResultAllRandom(result, pair, word) {
				var newResult = {
					correct : result,
					letter : pair,
					word : word
				}
				self.results.push(newResult);
				$timeout(() => {
					var elem = document.getElementById('word-in-1-set-result');
					elem.scrollTop = elem.scrollHeight;
				})
			}

			/************************************
				END EXERCISE: WORD IN 1 SET *
			 ************************************/

			/********************************
				NOTE: EXERCISE: MEMO PRACTICE *
			 ********************************/

			var setting = {
				totalWord : 10,
				wordPerDisplay : 1,
				timePerDisplay : 1000
			},
			letterPairArray = [], questionPair;

			this.setting = angular.copy(setting);
			this.disableInput = true

			this.updateSetting = (totalWord, wordPerDisplay, timePerDisplay) => {
				setting.totalWord = totalWord;
				setting.wordPerDisplay = wordPerDisplay;
				setting.timePerDisplay = timePerDisplay;
			}

			this.startMemoPractice = () => {
				this.disableInput = true;
				this.myAnswer = '';
				this.memoResult = '';
				var allLetterPair = getLetterPairArray();
				questionPair = sampleSize(allLetterPair, setting.totalWord);
				questionPair = chunk(questionPair, setting.wordPerDisplay);
				setDisplayTimeout(questionPair, setting.timePerDisplay);
			}

			function getLetterPairArray() {
				if (letterPairArray.length <= 0) {
					for (var preLetter in letterPair) {
						if (letterPair.hasOwnProperty(preLetter) && preLetter !== 'B') {
							letterPairArray = letterPairArray.concat(Object.keys(letterPair[preLetter]).map((sufLetter) => preLetter + sufLetter))
						}
					}
					return letterPairArray;
				} else {
					return letterPairArray;
				}
			}

			function setDisplayTimeout(arrayOfWordChunk, delay) {
				document.querySelector(".memo-practice-input").value = ''
				self.totalDisplayStep = arrayOfWordChunk.length;
				arrayOfWordChunk.map((chunk, index) => {
					$timeout(() => {
						self.displayStep = index + 1;
						self.displayWords = chunk.reduce((acc, ele) => acc = acc + ele + " ", "");
					}, delay * index);
				})
				$timeout(() => {
					self.displayWords = ''
					self.disableInput = false;
					$timeout(() => document.querySelector(".memo-practice-input").focus())
				}, delay * (arrayOfWordChunk.length));
			}

			this.submitAnswerExe2 = (answer) => {
				this.myAnswer = answer.toUpperCase().split(" ");
				this.memoResult = flattenDeep(questionPair)
			}

			/**************************************
				END EXERCISE 2: MEMO PRACTICE *
			 **************************************/
		}
	]
}
