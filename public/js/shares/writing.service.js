"use strict";

import angular from 'angular';

export default angular.module("writing.service", []).service("writingService", ["authService",
	function (authService) {
		var service = {};

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

		service.getWritingById = (id) => {
			return fetch(process.env.API_URL + `writing/id/${id}`, {
				headers : {
					"Authorization" : `Bearer ${authService.getAccessToken()}`
				}
			}).then(res => res.json()).catch(err => console.log(err))
		}

		function getWritingFromLocal(type) {
			return JSON.parse(localStorage.getItem(`writing-${type}`))
		}

		function getWritingFromServer(type) {
			return fetch(process.env.API_URL + `writing/${type}`, {
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
