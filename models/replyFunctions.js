const errors = {
	"InternalServerError": (reply, details) => {
		const acknowledgement = {
			"code": 500,
			"message": "Internal Server Error",
			"error": {
				"details": details
			}
		};
		return reply.status(acknowledgement.code).json(acknowledgement);
	},
	"Conflict": (reply, details) => {
		const acknowledgement = {
			"code": 409,
			"message": "Conflict",
			"error": {
				"details": details
			}
		};
		return reply.status(acknowledgement.code).json(acknowledgement);
	},
	"Unauthorized": (reply, details) => {
		const acknowledgement = {
			"code": 401,
			"message": "Unauthorized",
			"error": {
				"details": details
			}
		};
		return reply.status(acknowledgement.code).json(acknowledgement);
	},
	"BadRequest": (reply, details) => {
		const acknowledgement = {
			"code": 400,
			"message": "Bad Request",
			"error": {
				"details": details
			}
		};
		return reply.status(acknowledgement.code).json(acknowledgement);
	},
	"NotFound": (reply, details) => {
		const acknowledgement = {
			"code": 404,
			"message": "Not Found",
			"error": {
				"details": details
			}
		};
		return reply.status(acknowledgement.code).json(acknowledgement);
	},
	"Timeout": (reply, details) => {
		const acknowledgement = {
			"code": 504,
			"message": "Timeout",
			"error": {
				"details": details
			}
		};
		return reply.status(acknowledgement.code).json(acknowledgement);
	},
	"ServiceUnavailable": (reply, details) => {
		const acknowledgement = {
			"code": 503,
			"message": "Service Unavailable",
			"error": {
				"details": details
			}
		};
		return reply.status(acknowledgement.code).json(acknowledgement);
	}
};

const success = {
	"NoData": (reply) => {
		const acknowledgement = {};
		return reply.status(204).json(acknowledgement);
	},
	"Success": (reply, data) => {
		const acknowledgement = {
			"data": data
		};
		return reply.json(acknowledgement);
	}
};

const replyFunctions = {
	"errors": errors,
	"success": success
};

module.exports = replyFunctions;
