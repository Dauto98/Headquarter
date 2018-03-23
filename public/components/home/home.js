import React from "react";
import sample from "lodash/sample";

import style from "./home.css";

var backgroundSrc = require.context("../../../img/homeBackground", true, /\.(png|jpeg|jpg|gif)$/);
backgroundSrc = backgroundSrc.keys().map(backgroundSrc);
backgroundSrc = sample(backgroundSrc);

var quote = sample([
	{
		content : "When you feel max-out both mentally and physically, you're only at 40% of your capacity",
		author : "Medium writer"
	},
	{
		content : "If you need permission, you probably shouldn't do it",
		author : "Medium writer"
	},
	{
		content : "Don’t think. You already know what you have to do, and you know how to do it. What’s stopping you?",
		author : "Tim Grover"
	},
	{
		content : "Sometimes before I go to sleep, I lay in bed. thinking of how many things I could have done to be a better human today",
		author : "The Angry Therapist"
	},
]);


class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			clock : new Date()
		};
	}

	componentDidMount() {
		this.timerId = setInterval(() => {
			this.setState({
				clock : new Date()
			});
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.timerId);
	}

	render() {
		return (
			<React.Fragment>
				<img src={backgroundSrc.src} srcSet={backgroundSrc.srcSet} sizes="100vw" className={style.homeBackground} alt=""/>

				<div className={style.homeWelcome}>
					<span className={style.welcomeTitle}>Welcome home, Dauto98</span>
					<span className={style.welcomeClock}>{this.state.clock.toLocaleTimeString([], { hour12 : false })}</span>
				</div>

				<div className={style.quote}>
					<p>{quote.content}</p>
					<p>{quote.author}</p>
				</div>
			</React.Fragment>
		);
	}
}

export default Home;
