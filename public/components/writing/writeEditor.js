import React from "react";
import PropTypes from "prop-types";
import pell from "pell";

import Dropdown from "react-toolbox/lib/dropdown";
import { Button } from "react-toolbox/lib/button";

import { getAccessToken } from "../auth/auth.js";
import WritingList from "./writingList.js";

import style from "./writeEditor.css";

const writingTypes = [
	{value : "journal", label : "Journal"},
	{value : "changeLog", label : "Change Log"}
];

function saveContent(action, {html, type, ...rest}) {
	if (action == "new") {
		return fetch(process.env.API_URL + "writing/create", {
			method: "post",
			headers: {
				"Accept": "application/json, text/plain, */*",
				"Content-Type": "application/json",
				"Authorization" : `Bearer ${getAccessToken()}`
			},
			body: JSON.stringify({html, type})
		}).then((res) => {
			return res.text();
		}).catch((err) => {
			console.log(err); //eslint-disable-line
		});
	} else if (action == "edit") {
		return fetch(process.env.API_URL + `writing/update/${rest.id}`, {
			method: "put",
			headers: {
				"Accept": "application/json, text/plain, */*",
				"Content-Type": "application/json",
				"Authorization" : `Bearer ${getAccessToken()}`
			},
			body: JSON.stringify({html, type})
		}).then((res) => {
			return res.text();
		}).catch((err) => {
			console.log(err); //eslint-disable-line
		});
	}
}

class WriteEditor extends React.Component {
	state = {
		currentType : "journal"
	}

	currentContent = "";

	static propTypes = {
		initContent : PropTypes.object,
		renderAfterSave : PropTypes.func.isRequired
	}

	componentDidMount() {
		let editor = pell.init({
			element: document.getElementById("writingEditor"),
			onChange: html => this.currentContent = html,
			defaultParagraphSeparator: "div",
			styleWithCSS: false,
			classes: {
				actionbar: "pell-actionbar",
				button: "pell-button",
				content: "pell-content",
				selected: "pell-button-selected"
			}
		});
		if (this.props.initContent) {
			editor.content.innerHTML = this.props.initContent.html;
			this.setState({currentType : this.props.initContent.type});
		}
	}

	changeType = (value) => {
		this.setState({currentType : value});
	}

	submitContent = () => {
		let data = {
			html : this.currentContent,
			type : this.state.currentType
		};
		if (this.props.initContent) {
			data = {...this.props.initContent, ...data};
		}
		saveContent(data.createdAt ? "edit" : "new", data).then(() => this.props.renderAfterSave(<WritingList renderForEdit={this.props.renderAfterSave}/>));
	}

	render() {
		return (
			<div className={style.editorOuterContainer}>
				<Dropdown source={writingTypes} value={this.state.currentType} onChange={this.changeType} label="Choose type" theme={{inputInputElement : style.dropdownBottomBorder}}/>
				<div id="writingEditor" className={style.writingEditor}></div>
				<Button label="Submit" theme={{button : style.submitButton}} raised onClick={this.submitContent}/>
			</div>
		);
	}
}

export default WriteEditor;
