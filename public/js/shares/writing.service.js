"use strict";

import angular from 'angular';

export default angular.module("writing.service", []).service("writingService", ["authService",
	function (authService) {
		var service = {};

		service.getAllWriting = (type) => {
			var data = getWritingFromLocal();
			if (!data || data.length === 0) {
				return getWritingFromServer().then((res) => {
					localStorage.setItem('writing', JSON.stringify(res));
					return res;
				});
			} else {
				return Promise.resolve(data)
			}
		}

		service.getWritingById = (id) => {
			return fetch(process.env.API_URL + `writing/${id}`, {
				headers : {
					"Authorization" : `Bearer ${authService.getAccessToken()}`
				}
			}).then(res => res.json()).catch(err => console.log(err))
		}

		function getWritingFromLocal() {
			return JSON.parse(localStorage.getItem('writing'))
		}

		function getWritingFromServer() {
			return fetch(process.env.API_URL + "writing/", {
				headers : {
					"Authorization" : `Bearer ${authService.getAccessToken()}`
				}
			}).then((res) => res.json()).catch((err) => console.log(err))
		}

		service.saveWriting = (type, delta, html, id = null) => {
			if (id) {
				return fetch(process.env.API_URL + `writing/update/${id}`, {
					method: 'put',
					headers: {
						'Accept': 'application/json, text/plain, */*',
						'Content-Type': 'application/json',
						"Authorization" : `Bearer ${authService.getAccessToken()}`
					},
					body: JSON.stringify({delta, html, id})
				}).then((res) => {
					localStorage.removeItem('writing');
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
					body: JSON.stringify({delta, html})
				}).then((res) => {
					localStorage.removeItem('writing');
					return res.text()
				}).catch((err) => {
					console.log(err);
				})
			}
		}

		service.remove = (id) => {
			return fetch(process.env.API_URL + `writing/remove/${id}`, {
				method : 'delete',
				headers : {
					"Authorization" : `Bearer ${authService.getAccessToken()}`
				}
			}).then((res) => {
				localStorage.removeItem('writing');
				return res.text()
			}).catch((err) => console.log(err))
		}

		return service;
	}
])
