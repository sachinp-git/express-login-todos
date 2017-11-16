const bluebird = require("bluebird");
const ioredis = bluebird.promisifyAll(require("ioredis"));
const R = {
	"db": {}
};

module.exports = {
	"init": init,
	"get": get
};

function init(dbConfiguration, serverConfig) {
	R.conf = serverConfig;
	R.db.redis = new ioredis(dbConfiguration.redis);
}

function get() {
	return R;
}
