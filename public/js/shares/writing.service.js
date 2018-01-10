"use strict";

import angular from 'angular';

export default angular.module("writing.service", []).service("writingService", [
	function () {
		var service = {};

		service.getAllWriting = (type) => {
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
				return res.text()
			}).catch((err) => {
				console.log(err);
			})
		}

		return service;
	}
])
