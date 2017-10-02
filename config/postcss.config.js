const stylelint = require('stylelint');
const stylelintConfig = require('./stylelint.config.js');
const autoprefixer = require('autoprefixer');

module.exports = {
	plugins: [
		stylelint(stylelintConfig),
		autoprefixer(),
	]
};
