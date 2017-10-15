module.exports = {
    //"extends": "airbnb-base",

	"extends": "airbnb",

	"globals": {
		"document": true
	},

	"rules": {
		"strict": 0,
		"comma-dangle": 0,
		"no-tabs": 0,
		"indent": [2, "tab", {"SwitchCase": 1}],
		"arrow-parens": [2, "as-needed"],
		"no-underscore-dangle": [2, {"allowAfterThis": true}],
		"max-len": [2, 120, 4, {"ignoreUrls": true}],
		"no-confusing-arrow": [2, {"allowParens": true}],
		"object-curly-spacing": [2, "always"],

		"import/no-extraneous-dependencies": 0,
		"import/no-unresolved": 0,

		"jsx-quotes": [2, "prefer-single"],

		"jsx-a11y/href-no-hash": [0],
		"no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
		"no-use-before-define": ["error", { "functions": false, "classes": false }],
		"class-methods-use-this": [0],
		"no-case-declarations": [0],

		"react/jsx-filename-extension": [1, {"extensions": [".js", ".jsx"]}],
		"react/jsx-indent": [2, "tab"],
		"react/jsx-indent-props": [2, "tab"],
		"react/jsx-closing-bracket-location": [1, "after-props"],
		"react/require-default-props": 0,
		"react/no-array-index-key": 0
	}
};