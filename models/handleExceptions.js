const replyFunctions = require("./replyFunctions");

function handleExceptions(request, reply, next) {
	try {
		next();
		reply.setTimeout(5000, timeoutHandler);
	}
	catch (e) {
		return replyFunctions.errors.ServiceUnavailable(reply, "Process exited with status 0");
	}
}

function timeoutHandler() {
	this.status(504).json({
		"message": "Server Timeout"
	});
}

module.exports = handleExceptions;
