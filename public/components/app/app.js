import React from "react";
import AppBar from "react-toolbox/lib/app_bar";

import style from "./app.css";

const App = () => {
	return (
		<div className={style.test}>
			<AppBar></AppBar>
			Hello world
		</div>
	);
};

export default App;
