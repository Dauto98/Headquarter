/* eslint no-console : 0 */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.Promise = Promise;
mongoose.connect(process.env.DB_URL, {
	useMongoClient : true
});
mongoose.connection.on("error", console.error.bind(console, "database connection error"));
mongoose.connection.once("open", () => console.log("connect DB successfully"));

app.use(bodyParser.urlencoded({"extended" : "true"}));
app.use(bodyParser.json());
app.use(bodyParser.json({type : "application/vnd.api+json"}));

app.use(express.static(__dirname + "/public/dist", {index : false}));
require("./app/routes.js")(app);

app.listen(process.env.PORT || 8000);
console.log(`App listening on port ${process.env.PORT || 8000}`);
