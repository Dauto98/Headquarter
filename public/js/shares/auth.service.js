"use strict";

import angular from 'angular';
import angularAuth0Module from 'angular-auth0'
import auth0 from 'auth0-js';

export default angular.module("auth.service", [angularAuth0Module]).config(["angularAuth0Provider", "$stateProvider",
	(angularAuth0Provider, $stateProvider) => {
		angularAuth0Provider.init({
			clientID : process.env.auth_clientID,
			domain : process.env.auth_domain,
			responseType : 'token id_token',
			audience : process.env.auth_audience,
			redirectUri : process.env.auth_redirectUri,
			scope : 'openid'
		})

		$stateProvider.state({
			name : 'login_callback',
			url : '/login_callback',
			resolve : {
				data : ["authService", "$state", "$timeout", (authService, $state, $timeout) => {
					// NOTE: angularAuth0.parseHash is ASYNC, i don't know why, and they don't metion it :(
					return new Promise(function(resolve, reject) {
						authService.parseAuthData(resolve)
					}).then(() => $timeout(() => $state.go('home')))
				}]
			}
		})
	}
]).service("authService", ["angularAuth0",
	function (angularAuth0) {
		var service = {};

		service.login = () => {
			angularAuth0.authorize()
		}

		service.parseAuthData = (done) => {
			angularAuth0.parseHash((err, result) => {
				if (err) {
					console.log(err);
				} else {
					localStorage.setItem("accessToken", JSON.stringify(result.accessToken))
					localStorage.setItem("idToken", JSON.stringify(result.idToken))
					localStorage.setItem("expiresAt", JSON.stringify(result.expiresIn*1000 + Date.now()));
					done()
				}
			})
		}

		service.isAuthenticated = () => {
			let exprireAt = JSON.parse(localStorage.getItem('expiresAt'))
			if (exprireAt && localStorage.getItem("accessToken") && localStorage.getItem("idToken")) {
				return Date.now() < exprireAt;
			} else {
				return false;
			}
		}

		service.logout = () => {
			localStorage.removeItem("accessToken")
			localStorage.removeItem("idToken")
			localStorage.removeItem("expiresAt")
		}

		return service;
	}
])
