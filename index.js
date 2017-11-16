"use strict";
const express = require("express");
const expressLogger = require("express-logger");
const cors = require("cors");
const bodyParser = require("body-parser");
const commandLineArgs = require("command-line-args");
const handleExceptions = require("./models/handleExceptions");
const validateSchema = require("./utils/validateSchema");
const myConsole = console;

const users = require("./apis/users");
const todos = require("./apis/todos");

const optionDefinitions = [{
	"name": "port",
	"alias": "p",
	"type": Number,
	"defaultValue": 7878
}, {
	"name": "verbose",
	"alias": "v",
	"type": Boolean,
	"defaultValue": false
}];

const args = commandLineArgs(optionDefinitions);
if (args.verbose) {
	console.log = () => {};
}
const app = express();

const dbConnections = require("./configurations/dbConnections");
const serverConfig = require("./configurations/serverConfig");
const dbWrapper = require("./models/dbWrapper");

dbWrapper.init(dbConnections, serverConfig);

app.set("etag", false);

app.use(cors());
app.use(expressLogger({"path": "/tmp/api.log"}));
app.use(bodyParser.json());
app.use(handleExceptions);
app.use(validateSchema);

app.use("/users", users);
app.use("/todos", todos);

app.listen(args.port, () => {
	myConsole.info(`Listening on ${args.port}`);
});

process.on("uncaughtException", (error) => {
	myConsole.error(error);
});
