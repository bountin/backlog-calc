'use strict';

const path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const mapValues = require('lodash/mapValues');

const PORT = 3000;
const ASSETS_PATH = path.resolve(__dirname, 'build');
const SERVER_URL = 'http://localhost:' + PORT;
const entries = require('./entry.json');

module.exports = {

	debug   : true,
	devtool : 'eval-source-map',

	entry : mapValues(entries, entry => [
		entry,
		'webpack-dev-server/client?' + SERVER_URL,
		'webpack/hot/only-dev-server',
	]),

	output : {
		path       : ASSETS_PATH,
		filename   : '[name].js',
		publicPath : SERVER_URL + '/',
	},

	module : {
		preLoaders : [
			{ test : /\.js$/, loader : 'eslint', exclude : /node_modules/ },
		],
		loaders : [
			{ test : /\.js$/, loader : 'babel', exclude : /node_modules/ },
			{ test : /\.css$/, loader : 'style!css?sourceMap' },
			{ test : /\.less$/, loader : 'style!css?sourceMap&modules&localIdentName=[name]__[local]!less?sourceMap' },
			{ test : /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/, loader : 'url-loader?limit=8192' },
			{ test : /\.(gif|jpg|jpeg|png)(\?]?.*)?$/, loader : 'url-loader?limit=1024' },
			{ test : /\.json$/, loader : 'json', exclude : /node_modules/ },
		],
	},

	plugins : [
		new Webpack.NoErrorsPlugin(),
		new Webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({ template : 'assets/index.html', favicon : 'assets/favicon.ico', inject : 'body' }),
		new Webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
	],

	devServer : {
		port               : PORT,
		contentBase        : ASSETS_PATH,
		hot                : true,
		quiet              : false,
		noInfo             : true,
		inline             : true,
		colors             : true,
		historyApiFallback : true,
	},

};
