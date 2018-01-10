"use strict";

import angular from 'angular';

export default angular.module("writing.service", []).service("writingService", [
	function () {
		var service = {};

		service.getAllWriting = (type) => {
			var data = getWritingFromLocal();
			if (!data) {
				return getWritingFromServer().then((res) => {
					localStorage.setItem('writing', JSON.stringify(res));
					return res;
				});
			} else {
				return Promise.resolve(data)
			}
		}

		function getWritingFromLocal() {
			return JSON.parse(localStorage.getItem('writing'))
		}

		function getWritingFromServer() {
			return fetch("http://localhost:8000/api/writing/").then((res) => res.json()).catch((err) => console.log(err))
		}

		service.saveWriting = (type, delta, html) => {
			return fetch("http://localhost:8000/api/writing/create", {
			  method: 'post',
			  headers: {
			    'Accept': 'application/json, text/plain, */*',
			    'Content-Type': 'application/json'
			  },
			  body: JSON.stringify({delta, html})
			}).then((res) => {
				localStorage.removeItem('writing');
				return res.text()
			}).catch((err) => {
				console.log(err);
			})
		}

		service.remove = (id) => {
			return fetch(`http://localhost:8000/api/writing/remove/${id}`, {
				method : 'delete'
			}).then((res) => {
				localStorage.removeItem('writing');
				return res.text()
			}).catch((err) => console.log(err))
		}

		return service;
	}
])
