"use strict";
const express = require("express");
const Router = express.Router();
const R = require("../models/dbWrapper").get();
const replyFunctions = require("../models/replyFunctions");

Router.post("/set", (request, reply) => {
	const username = request.headers.username;
	const todo = JSON.stringify(request.body.data);
	addTodo(username, todo).then((response) => {
		return replyFunctions.success.NoData(reply);
	}).catch((error) => {
		return replyFunctions.errors.ServiceUnavailable(reply, "Please try again later!");
	});
});

function addTodo(username, todo) {
	const todosPrefix = R.conf.todosPrefix;
	const todoListKey = todosPrefix + username;
	return new Promise((resolve, reject) => {
		return R.db.redis.sadd(todoListKey, todo).then(resolve).catch(reject);
	});
}

Router.get("/all", (request, reply) => {
	const username = request.headers.username;
	getTodos(username).then((response) => {
		return replyFunctions.success.Success(reply, parseArray(response));
	}).catch((error) => {
		return replyFunctions.errors.ServiceUnavailable(reply, "Please try again later!");
	});
});

function parseArray(stringArray) {
	return stringArray.map((jsonString) => {
		return JSON.parse(jsonString);
	});
}

function getTodos(username) {
	const todosPrefix = R.conf.todosPrefix;
	const todoListKey = todosPrefix + username;
	return new Promise((resolve, reject) => {
		return R.db.redis.smembers(todoListKey).then(resolve).catch(reject);
	});
}

function deleteTodo(username, task) {
	return new Promise((resolve, reject) => {
		const todosPrefix = R.conf.todosPrefix;
		const todoListKey = todosPrefix + username;
		return R.db.redis.srem(todoListKey, task).then(resolve).catch(reject);
	});
}

Router.delete("/delete", (request, reply) => {
	const username = request.headers.username;
	const task = JSON.stringify(request.body.data);
	deleteTodo(username, task).then((response) => {
		return replyFunctions.success.NoData(reply);
	}).catch((error) => {
		return replyFunctions.errors.ServiceUnavailable(reply, "Please try again later!");
	});
});

module.exports = Router;
