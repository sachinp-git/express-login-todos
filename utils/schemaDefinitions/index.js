"use strict";
const joi = require("joi");

const schemas = {
	"POST": {
		"/users/login": {
			"body": joi.object({
				"username": joi.string().required(),
				"password": joi.string().required()
			}).required()
		},
		"/users/signup": {
			"body": joi.object({
				"username": joi.string().required(),
				"password": joi.string().required(),
				"confirmPassword": joi.string().required().valid(joi.ref("password"))
			})
		},
		"/todos/set": {
			"body": joi.object({
				"data": joi.object({
					"task": joi.string().required()
				}).required()
			}),
			"headers": joi.object({
				"authenticationtoken": joi.string().required(),
				"username": joi.string().required()
			}).unknown()
		}
	},
	"GET": {
		"/users/logout": {
			"headers": joi.object({
				"authenticationtoken": joi.string().required(),
				"username": joi.string().required()
			}).unknown()
		},
		"/todos/all": {
			"headers": joi.object({
				"authenticationtoken": joi.string().required(),
				"username": joi.string().required()
			}).unknown()
		}
	},
	"DELETE": {
		
	}
};

function get(method, url) {
	return schemas[method][url];
}

module.exports = get;
