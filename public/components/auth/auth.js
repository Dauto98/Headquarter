import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth0 from "auth0-js";

var webAuth = new auth0.WebAuth({
	domain: process.env.auth_domain,
	clientID: process.env.auth_clientID,
	redirectUri: process.env.auth_redirectUri,
	audience: process.env.auth_audience,
	responseType: "token id_token",
	scope: "openid"
});

function setSession (authResult) {
	localStorage.setItem("accessToken", authResult.accessToken);
	localStorage.setItem("idToken", authResult.idToken);
	localStorage.setItem("expiresAt", JSON.stringify(authResult.expiresIn * 1000 + Date.now()));
}

export function login() {
	webAuth.authorize();
}

export function logout() {
	localStorage.removeItem("accessToken");
	localStorage.removeItem("idToken");
	localStorage.removeItem("expiresAt");
}

export function isAuthenticated() {
	// let exprireAt = JSON.parse(localStorage.getItem("expiresAt"));
	// if (exprireAt && localStorage.getItem("accessToken") && localStorage.getItem("idToken")) {
	// 	return Date.now() < exprireAt;
	// } else {
	// 	return false;
	// }
	return false;
}

export function handleAuthentication() {
	webAuth.parseHash((err, authResult) => {
		if (authResult && authResult.accessToken && authResult.idToken) {
			setSession(authResult);
			history.replace("/");
		} else if (err) {
			history.replace("/");
			//eslint-disable-next-line
			console.log(err);
		}
	});
}

export const PrivateRoute = ({ component: Component, ...rest }) => ( //eslint-disable-line
	<Route {...rest} render={props =>	isAuthenticated() ?
		(
			<Component {...props} />
		) : (
			<Redirect to="/"/>
		)}
	/>
);

export const AuthComponent = () => {};
