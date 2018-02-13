"use strict";

import angular from 'angular';
import angularAuth0Module from 'angular-auth0';
import auth0 from 'auth0-js';

export default angular.module("auth.service", [angularAuth0Module]).config(["angularAuth0Provider", "$stateProvider",
	(angularAuth0Provider, $stateProvider) => {
		// init auth0
		angularAuth0Provider.init({
			clientID : process.env.auth_clientID,
			domain : process.env.auth_domain,
			responseType : 'token id_token',
			audience : process.env.auth_audience,
			redirectUri : process.env.auth_redirectUri,
			scope : 'openid'
		})

		// register a state used to handle login callback from auth0
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
]).service("authService", ["angularAuth0", "$state",
	function (angularAuth0, $state) {
		var service = {}, tokenRenewalTimeout;

		function setTokenRenewalTimeout() {
			clearTimeout(tokenRenewalTimeout);
			var expiresAt = JSON.parse(localStorage.getItem("expiresAt"));
			// if only use setTimeout, then the renewal process will be delay after the ui-router's redirect check come in
			if (expiresAt < Date.now()) {
				renewToken();
			} else {
				tokenRenewalTimeout = setTimeout(renewToken, expiresAt - Date.now());
			}
		}

		function renewToken() {
			angularAuth0.checkSession({}, (err, authResult) => {
				if (err) {
					console.log(err);
				} else {
					saveAuthData(authResult);
					setTokenRenewalTimeout();
					$state.reload()
				}
			})
		}

		setTokenRenewalTimeout();

		service.login = () => {
			angularAuth0.authorize();
		}

		service.parseAuthData = (done) => {
			angularAuth0.parseHash((err, result) => {
				if (err) {
					console.log(err);
				} else {
					saveAuthData(result);
					setTokenRenewalTimeout()
					done()
				}
			})
		}

		service.isAuthenticated = () => {
			let exprireAt = JSON.parse(localStorage.getItem('expiresAt'));
			if (exprireAt && localStorage.getItem("accessToken") && localStorage.getItem("idToken")) {
				return Date.now() < exprireAt;
			} else {
				return false;
			}
		}

		service.logout = () => {
			localStorage.removeItem("accessToken");
			localStorage.removeItem("idToken");
			localStorage.removeItem("expiresAt");
			clearTimeout(tokenRenewalTimeout);
		}

		service.getAccessToken = () => {
			return JSON.parse(localStorage.getItem("accessToken")) || "";
		}

		function saveAuthData(authResult) {
			localStorage.setItem("accessToken", JSON.stringify(authResult.accessToken));
			localStorage.setItem("idToken", JSON.stringify(authResult.idToken));
			localStorage.setItem("expiresAt", JSON.stringify(authResult.expiresIn*1000 + Date.now()));
		}

		return service;
	}
])
