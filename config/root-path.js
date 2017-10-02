const path = require('path');

const rootDir = path.resolve('.');
const join = path.join.bind(path, rootDir);

module.exports = {
	dir: rootDir,
	join
};
