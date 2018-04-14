import React from "react";

import { Tabs, Tab } from "react-toolbox/lib/tabs";

import WritingList from "./writingList.js";
import WriteEditor from "./writeEditor.js";

import style from "./writing.css";

class Writing extends React.Component {
	renderContent = (component) => {
		this.setState({writingContent : component});
	}

	state = {
		index : 0,
		writingContent : <WritingList renderForEdit={this.renderContent}/>
	}

	handleTabChange = (index) => {
		this.setState({index});
	};

	render() {
		return (
			<React.Fragment>
				<Tabs index={this.state.index} onChange={this.handleTabChange} theme={{navigation : style.navigation, label : style.label}}>
					<Tab label="List" onActive={() => this.renderContent(<WritingList renderForEdit={this.renderContent}/>)}></Tab>
					<Tab label="Write" onActive={() => this.renderContent(<WriteEditor renderAfterSave={this.renderContent}/>)}></Tab>
				</Tabs>
				{this.state.writingContent}
			</React.Fragment>
		);
	}
}

export default Writing;
