import React from "react";
import { Route } from "react-router-dom";

import Header from "../header/header.js";
import Home from "../home/home.js";
import { AuthComponent, PrivateRoute } from "../auth/auth.js";
import Writing from "../writing/writing.js";
import Budget from "../budget/budget.js";

const App = () => {
	return (
		<React.Fragment>
			<Header/>

			<Route exact path="/" component={Home}/>
			<Route exact path="/login_callback" component={AuthComponent}/>
			<PrivateRoute exact path="/writing" component={Writing}/>
			<PrivateRoute exact path="/budget" component={Budget}/>
		</React.Fragment>
	);
};

export default App;
