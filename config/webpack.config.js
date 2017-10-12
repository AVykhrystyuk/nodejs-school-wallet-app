'use strict';

// const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const rootPath = require('./root-path');

const root = rootPath.join;
const rootDir = rootPath.dir;

module.exports = env => {
	const isProduction = env ? !!env.production : false;
	// eslint-disable-next-line no-console
	console.log(`webpack: isProduction = ${isProduction}`);

	const options = {
		isProd: isProduction,
		isTest: false,
		plugins: {
			extractCSS: new ExtractTextPlugin({
				filename: '[name].css',
				allChunks: true
			})
		}
	};

	return makeWebpackConfig(options);
};

function makeWebpackConfig(options) {
	const config = {
		context: root('source', 'client'),
		devtool: 'source-map'
	};

	config.entry = {
		app: './index.js',
		// vendor: './vendor/index.js',
	};

	config.output = {
		path: root('build'),
		filename: '[name].bundle.js'
	};

	config.module = {
		rules: getAllModuleRules(options)
	};

	// config.resolve = {
	// 	extensions: ['.js', '.ts'],
	// };

	config.plugins = getPlugins(options);

	return config;
}

function getPlugins(options) {
	const NODE_ENV = options.isProd ? 'production' : 'development';

	const plugins = [
		new CleanWebpackPlugin(['build'], {
			root: rootDir
		}),
		/*
				new webpack.optimize.CommonsChunkPlugin({
					name: ['app', 'vendor', 'polyfills']
				}),
		*/
		new CopyWebpackPlugin([{
			from: './__copy-to-output__',
			// to: "build"
		}]),

		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(NODE_ENV)
			}
		}),

		new WebpackNotifierPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new HtmlWebpackPlugin({
			title: 'My wallet app',
			template: './templates/index.ejs',
			filename: 'index.html',
			inject: 'body',
			chunksSortMode: 'dependency'
		}),
	];

	if (options.isProd) {
		plugins.push(
			new webpack.optimize.UglifyJsPlugin({
				sourceMap: true,
				warnings: true,
				comments: false
			})
		);
	}

	if (!options.isTest) {
		plugins.push(options.plugins.extractCSS);
	}

	return plugins;
}

function getAllModuleRules(options) {
	const allModuleRules = [{
		test: /\.js$/,
		exclude: /node_modules/,
		use: [{
			loader: 'babel-loader'
		}/* , { loader: 'eslint-loader' } */]
	}];

	if (!options.isTest) {
		const styleRules = getStyleModuleRules(options);
		allModuleRules.push(...styleRules);
	}

	return allModuleRules;
}

function getStyleModuleRules(options) {
	const styleLoader = {
		loader: 'style-loader'
	};

	const cssLoader = {
		loader: 'css-loader',
		options: {
			sourceMap: true,
			minimize: options.isProd
		}
	};

	const postCssLoader = {
		loader: 'postcss-loader',
		options: {
			sourceMap: true,
			config: {
				path: root('config', 'postcss.config.js')
			}
		}
	};

	const sassLoader = {
		loader: 'sass-loader',
		options: {
			sourceMap: true
		}
	};

	const extractedStyleRegex = /node_modules|source(\\|\/)client(\\|\/)vendor/;

	const appRules = [{
		test: /\.css$/,
		exclude: extractedStyleRegex,
		use: [styleLoader, cssLoader, postCssLoader]
	}, {
		test: /\.scss$/,
		exclude: extractedStyleRegex,
		use: [styleLoader, cssLoader, postCssLoader, sassLoader]
	}];

	const vendorRules = [{
		test: /\.css$/,
		include: extractedStyleRegex,
		use: options.plugins.extractCSS.extract([cssLoader, postCssLoader])
	}, {
		test: /\.scss$/,
		include: extractedStyleRegex,
		use: options.plugins.extractCSS.extract([cssLoader, postCssLoader, sassLoader])
	}];

	const allRules = [];
	allRules.push(...appRules);
	allRules.push(...vendorRules);
	return allRules;
}
