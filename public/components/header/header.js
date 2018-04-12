import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import AppBar from "react-toolbox/lib/app_bar";
import Link from "react-toolbox/lib/link";
import Drawer from "react-toolbox/lib/drawer";

import { isAuthenticated, logout, login } from "../auth/auth.js";

import style from "./header.css";

/**
 * React-router Link and React-toolbox Link won't work together since they create nested <a>
 * This class wrapped React-toolbox Link with the react-router transition API
 * @extends React.Component
 */
class WrappedLink extends React.Component {
	constructor(props) {
		super(props);
		this.handleNavgation = this.handleNavgation.bind(this);
		this.filteredProps = (({match, location, history, to, staticContext, onClick, ...rest}) => rest)(props); //eslint-disable-line
	}

	static get propTypes () {
		return {
			match: PropTypes.object.isRequired,
			location: PropTypes.object.isRequired,
			history: PropTypes.object.isRequired,
			to : PropTypes.string,
			label : PropTypes.string,
			onClick : PropTypes.func
		};
	}

	handleNavgation() {
		this.props.history.push(this.props.to);
		this.props.onClick && this.props.onClick();
	}

	render() {
		return (
			<Link onClick={this.handleNavgation} {...this.filteredProps}/>
		);
	}
}

WrappedLink = withRouter(WrappedLink); //eslint-disable-line

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			drawerActive : false
		};
		this.toogleDrawer = this.toogleDrawer.bind(this);
	}

	toogleDrawer() {
		this.setState({
			drawerActive : !this.state.drawerActive
		});
	}

	render() {
		return (
			<AppBar title="Headquarter" flat theme={{appBar : style.appBar}}>
				{ isAuthenticated() ?
					(
						<React.Fragment>
							<WrappedLink to="/" label="Home" className={style.navLinkBig}/>
							<WrappedLink to="/writing" label="Writing" className={style.navLinkBig}/>
							<WrappedLink to="/budget" label="Budget" className={style.navLinkBig}/>
							<Link onClick={logout} label="Logout" className={style.navLinkBig}/>

							<Link onClick={this.toogleDrawer} label="&#9776;" className={style.navLinkSmall}/>
							<Drawer active={this.state.drawerActive} onOverlayClick={this.toogleDrawer} className={style.navLinkSmall} type="right">
								<WrappedLink to="/" label="Home" onClick={this.toogleDrawer} className={style.drawerLink}/>
								<WrappedLink to="/writing" label="Writing" onClick={this.toogleDrawer} className={style.drawerLink}/>
								<WrappedLink to="/budget" label="Budget" onClick={this.toogleDrawer} className={style.drawerLink}/>
								<Link onClick={logout} label="Logout" className={style.drawerLink}/>
							</Drawer>
						</React.Fragment>
					) : (
						<Link onClick={login} label="Login"/>
					)
				}
			</AppBar>
		);
	}
}

export default Header;
