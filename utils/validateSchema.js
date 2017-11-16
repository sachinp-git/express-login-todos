const joi = require("joi");
const schemaDefinitions = require("./schemaDefinitions/");
const replyFunctions = require("../models/replyFunctions");

function validateSchema(request, reply, next) {
	const requestSchema = schemaDefinitions(request.method, request.originalUrl);
	if (requestSchema) {
		let error = validateRequestSchema(request, requestSchema);
		if (error) {
			return replyFunctions.errors.BadRequest(reply, error.details[0].message);
		}
		else {
			return next();
		}
	}
	else {
		return next();
	}
}

function validateRequestSchema(request, requestSchema) {
	const url = request.originalUrl;
	const method = request.method;

	let error = null;
	if (method === "POST" && requestSchema.body) {
		error = joi.validate(request.body, requestSchema.body).error;
	}
	if(requestSchema.headers) {
		error = error || joi.validate(request.headers, requestSchema.headers).error;
	}
	return error;
}

module.exports = validateSchema;
