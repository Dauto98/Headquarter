import React from "react";
import PropTypes from "prop-types";

import Dropdown from "react-toolbox/lib/dropdown";
import { Button } from "react-toolbox/lib/button";
import { IconMenu, MenuItem } from "react-toolbox/lib/menu";

import { getAccessToken } from "../auth/auth.js";
import WriteEditor from "./writeEditor.js";

import style from "./writingList.css";

const writingTypes = [
	{value : "journal", label : "Journal"},
	{value : "changeLog", label : "Change Log"}
];

/**
 * fetch writing on server
 * @param  {String} type Type of writing
 * @return {Promise}      a promise resolve to the JSON data
 */
function getWriting(type) {
	return fetch(process.env.API_URL + `writing/${type}`, {
		headers : {
			"Authorization" : `Bearer ${getAccessToken()}`
		}
	}).then((res) => res.json()).catch((err) => console.log(err)); //eslint-disable-line
}

function deletePost(id) {
	return fetch(process.env.API_URL + `writing/remove/${id}`, {
		method : "delete",
		headers : {
			"Authorization" : `Bearer ${getAccessToken()}`
		}
	}).then((res) => {
		return res.text();
	}).catch((err) => console.log(err)) //eslint-disable-line
}

class WritingList extends React.Component {
	state = {
		currentType : "journal"
	}

	static propTypes = {
		renderForEdit : PropTypes.func.isRequired
	}

	changeType = (value) => {
		this.setState({currentType : value});
		getWriting(value).then((data) => {
			let htmlContent = data.data.map((post) => (
				<div key={post.id} className={style.postContainer}>
					<h4 className={style.postTime}>{(new Date(post.createdAt)).toLocaleString({hour12 : false})}</h4>
					<IconMenu>
						<MenuItem caption="Edit" onClick={() => this.props.renderForEdit(<WriteEditor initContent={post} renderAfterSave={this.props.renderForEdit}/>)}/>
						<MenuItem caption="Delete" onClick={() => deletePost(post.id).then(() => this.changeType(post.type))}/>
					</IconMenu>
					<div className={style.postContent} dangerouslySetInnerHTML={{__html : post.html}}></div>
				</div>
			));
			this.setState({htmlContent});
		});
	}

	componentDidMount() {
		this.changeType("journal");
	}

	render() {
		return (
			<div className={style.outerContainer}>
				<div className={style.typeContainer}>
					<Dropdown className={style.smallChangeType} source={writingTypes} value={this.state.currentType} onChange={this.changeType} label="Choose type" theme={{inputInputElement : style.dropdownBottomBorder}}/>
					<div className={style.bigChangeType}>
						<Button label="Journal" theme={{button : style.typeButton}} raised={this.state.currentType == "journal" && true} primary={this.state.currentType == "journal" && true} onMouseUp={() => this.changeType("journal")}/>
						<Button label="Change log" theme={{button : style.typeButton}} raised={this.state.currentType == "changeLog" && true} primary={this.state.currentType == "changeLog" && true} onMouseUp={() => this.changeType("changeLog")}/>
					</div>
				</div>
				<div className={style.contentContainer}>
					{this.state.htmlContent}
				</div>
			</div>
		);
	}
}

export default WritingList;
