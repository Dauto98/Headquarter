import React from "react";

import { Tabs, Tab } from "react-toolbox/lib/tabs";

import style from "./writing.css";

class Writing extends React.Component {
	state = {
		index : 0
	}

	handleTabChange = (index) => {
		this.setState({index});
	};

	render() {
		return (
			<React.Fragment>
				<Tabs index={this.state.index} onChange={this.handleTabChange} theme={{navigation : style.navigation, label : style.tab}}>
					<Tab label="List"></Tab>
					<Tab label="Write"></Tab>
				</Tabs>
				<div>
					Content goes here
				</div>
			</React.Fragment>
		);
	}
}

export default Writing;
