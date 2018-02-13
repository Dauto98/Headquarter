"use strict";

import angular from 'angular';

export default angular.module("writing.service", []).service("writingService", ["authService",
	function (authService) {
		var service = {};

		/**
		 * get all writing posts
		 * @param  {String} type what type do you want
		 * @return {Promise}      a promise resolve with data
		 */
		service.getAllWriting = (type) => {
			var data = getWritingFromLocal(type);
			if (!data || data.length === 0) {
				return getWritingFromServer(type).then((res) => {
					localStorage.setItem(`writing-${res.type}`, JSON.stringify(res.data));
					return res.data;
				});
			} else {
				return Promise.resolve(data)
			}
		}

		/**
		 * get specific writing base on id
		 * @param  {Number} id Writing's id
		 * @return {Promise}    a promise resolve with data
		 */
		service.getWritingById = (id) => {
			return fetch(process.env.API_URL + `writing/id/${id}`, {
				headers : {
					"Authorization" : `Bearer ${authService.getAccessToken()}`
				}
			}).then(res => res.json()).catch(err => console.log(err))
		}

		/**
		 * get all writings from localStorage
		 * @param  {String} type what type of writings do you want ?
		 * @return {Object}      Data
		 */
		function getWritingFromLocal(type) {
			return JSON.parse(localStorage.getItem(`writing-${type}`))
		}

		/**
		 * get all writings from backend
		 * @param  {String} type what type of writings do you want ?
		 * @return {Promise}      A promise resolve with data
		 */
		function getWritingFromServer(type) {
			return fetch(process.env.API_URL + `writing/${type}`, {
				headers : {
					"Authorization" : `Bearer ${authService.getAccessToken()}`
				}
			}).then((res) => res.json()).catch((err) => console.log(err))
		}

		/**
		 * Save a new writing or update existing writing to database
		 * @param  {String} type      type of writing
		 * @param  {Object} delta     delta object of the writing
		 * @param  {String} html      An html string
		 * @param  {Number} [id=null] If exist, will update existing writing with id, if not, will create a new writing
		 * @return {String}           a "saved successfully" string
		 */
		service.saveWriting = (type, delta, html, id = null) => {
			if (id) {
				return fetch(process.env.API_URL + `writing/update/${id}`, {
					method: 'put',
					headers: {
						'Accept': 'application/json, text/plain, */*',
						'Content-Type': 'application/json',
						"Authorization" : `Bearer ${authService.getAccessToken()}`
					},
					body: JSON.stringify({delta, html, id, type})
				}).then((res) => {
					localStorage.removeItem(`writing-${type}`);
					return res.text()
				}).catch((err) => {
					console.log(err);
				})
			} else {
				return fetch(process.env.API_URL + "writing/create", {
					method: 'post',
					headers: {
						'Accept': 'application/json, text/plain, */*',
						'Content-Type': 'application/json',
						"Authorization" : `Bearer ${authService.getAccessToken()}`
					},
					body: JSON.stringify({delta, html, type})
				}).then((res) => {
					localStorage.removeItem(`writing-${type}`);
					return res.text()
				}).catch((err) => {
					console.log(err);
				})
			}
		}

		/**
		 * delete a writing with id
		 * @param  {Number} id
		 * @param  {String} type
		 * @return {String}      basically nothing
		 */
		service.remove = (id, type) => {
			return fetch(process.env.API_URL + `writing/remove/${id}`, {
				method : 'delete',
				headers : {
					"Authorization" : `Bearer ${authService.getAccessToken()}`
				}
			}).then((res) => {
				console.log(type);
				localStorage.removeItem(`writing-${type}`);
				return res.text()
			}).catch((err) => console.log(err))
		}

		return service;
	}
])
