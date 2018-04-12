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

var tokenRenewalTimeout;

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
	clearTimeout(tokenRenewalTimeout);
	window.location.reload();
}

export function isAuthenticated() {
	let exprireAt = JSON.parse(localStorage.getItem("expiresAt"));
	if (exprireAt && localStorage.getItem("accessToken") && localStorage.getItem("idToken")) {
		return Date.now() < exprireAt;
	} else {
		return false;
	}
}

function handleAuthentication(callback) {
	webAuth.parseHash((err, authResult) => {
		if (authResult && authResult.accessToken && authResult.idToken) {
			setSession(authResult);
			setTokenRenewalTimeout();
			callback();
		} else if (err) {
			callback();
			console.log(err); //eslint-disable-line
		}
	});
}

function setTokenRenewalTimeout() {
	clearTimeout(tokenRenewalTimeout);
	var expiresAt = JSON.parse(localStorage.getItem("expiresAt"));
	if (expiresAt < Date.now()) {
		renewToken();
	} else {
		tokenRenewalTimeout = setTimeout(renewToken, expiresAt - Date.now());
	}
}

function renewToken() {
	webAuth.checkSession({}, (err, authResult) => {
		if (err) {
			console.log(err); //eslint-disable-line
		} else {
			setSession(authResult);
			setTokenRenewalTimeout();
		}
	});
}

setTokenRenewalTimeout();

export const PrivateRoute = ({ component: Component, ...rest }) => ( //eslint-disable-line
	<Route {...rest} render={props =>	isAuthenticated() ?
		(
			<Component {...props} />
		) : (
			<Redirect to="/"/>
		)}
	/>
);

export class AuthComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			readyToRedirect : false
		};
	}

	componentDidMount() {
		handleAuthentication(() => {
			this.setState({ readyToRedirect : true });
		});
	}

	render() {
		return this.state.readyToRedirect ? (
			<Redirect to="/"/>
		) : (
			<div>Loading</div>
		);
	}
}
