"use strict";
const express = require("express");
const Router = express.Router();
const md5 = require("md5");
const uuidTokenGenerator = require("uuid-token-generator");
const TokenGenerator = new uuidTokenGenerator();
const R = require("../models/dbWrapper").get();
const replyFunctions = require("../models/replyFunctions");

Router.post("/signup", (request, reply) => {
	const userDetails = request.body;

	getUserDetails(userDetails).then((response) => {
		if (response) {
			return replyFunctions.errors.Conflict(reply, "User already exists");
		}
		const data = {
			"authenticationToken": generateToken(userDetails.username)
		};
		addNewUser(userDetails).then(replyFunctions.success.Success.bind(null, reply, data))
			.catch(replyFunctions.errors.InternalServerError.bind(null, reply, "Error while adding user details"));
	}).catch((error) => {
		return replyFunctions.errors.InternalServerError(reply, "Error while fetching user details");
	});
});

function getUserDetails(userDetails) {
	const username = userDetails.username;
	return new Promise((resolve, reject) => {
		R.db.redis.hget(username, "password").then(resolve).catch(reject);
	});
}

function addNewUser(userDetails) {
	const username = userDetails.username;
	delete userDetails.username;
	userDetails.password = md5(userDetails.password);

	return new Promise((resolve, reject) => {
		R.db.redis.hmset(username, userDetails).then(resolve).catch(reject);
	});
}

function generateToken(username) {
	const authenticationToken = TokenGenerator.generate();
	const transaction = R.db.redis.multi();
	transaction.set(authenticationToken, username);
	transaction.expire(authenticationToken, R.conf.redis.expire);
	transaction.exec().catch(console.error);
	return authenticationToken;
}

Router.post("/login", (request, reply) => {
	const userDetails = request.body;
	const password = md5(userDetails.password);

	getUserDetails(userDetails).then((response) => {
		if (!response) {
			return replyFunctions.errors.NotFound(reply, "Invalid credentials");
		}
		if (response !== password) {
			return replyFunctions.errors.Unauthorized(reply, "Invalid credentials");
		}
		const data = {
			"authenticationToken": generateToken(userDetails.username)
		};
		return replyFunctions.success.Success(reply, data);

	}).catch((error) => {
		return replyFunctions.errors.InternalServerError(reply, "Error while fetching user details");
	});
});

function invalidateAuthenticationToken(data) {
	const authenticationtoken = data.authenticationtoken;
	return new Promise((resolve, reject) => {
		return R.db.redis.del(authenticationtoken).then(resolve).catch(reject);
	});
}

Router.get("/logout", (request, reply) => {
	const username = request.headers.username;
	const authenticationtoken = request.headers.authenticationtoken;
	const data = {
		"authenticationtoken": authenticationtoken
	};
	invalidateAuthenticationToken(data).then((response) => {
		if (!response) {
			return replyFunctions.errors.Unauthorized(reply, "authenticationtoken Invalid");
		}
		return replyFunctions.success.NoData(reply);
	}).catch((reject) => {
		return replyFunctions.errors.InternalServerError(reply, "Error while invalidating authenticationtoken");
	});
});

module.exports = Router;
