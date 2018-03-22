import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import AppBar from "react-toolbox/lib/app_bar";
import Link from "react-toolbox/lib/link";

import { isAuthenticated, logout, login } from "../auth/auth.js";

class WrappedLink extends React.Component {
	constructor(props) {
		super(props);
		this.handleNavgation = this.handleNavgation.bind(this);
		//eslint-disable-next-line
		this.filteredProps = (({match, location, history, to, staticContext, ...rest}) => rest)(props);
	}

	static get propTypes () {
		return {
			match: PropTypes.object.isRequired,
			location: PropTypes.object.isRequired,
			history: PropTypes.object.isRequired,
			to : PropTypes.string,
			label : PropTypes.string,
		};
	}

	handleNavgation() {
		this.props.history.push(this.props.to);
	}

	render() {
		return (
			<Link onClick={this.handleNavgation} {...this.filteredProps}/>
		);
	}
}

// eslint-disable-next-line
WrappedLink = withRouter(WrappedLink);

const Header = () => (
	<AppBar title="Headquarter">
		{ isAuthenticated() ?
			(
				<React.Fragment>
					<WrappedLink to="/" label="Home"/>
					<WrappedLink to="/writing" label="Writing"/>
					<WrappedLink to="/budget" label="Budget"/>
					<Link onClick={logout} label="Logout"/>
				</React.Fragment>
			) : (
				<Link onClick={login} label="Login"/>
			)
		}
	</AppBar>
);

export default Header;
