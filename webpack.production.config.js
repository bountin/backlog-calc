var path = require('path');
var entries = require('./entry.json');
var Webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var xt = ExtractTextPlugin.extract.bind(ExtractTextPlugin);

var ASSETS_PATH = path.resolve(__dirname, 'build');

module.exports = {

	entry : entries,

	output : {
		path     : ASSETS_PATH,
		filename : '[name].js?[hash]'
	},

	module : {
		loaders : [
			{ test : /\.js$/, loader : 'babel', exclude : /node_modules/ },
			{ test : /\.css$/, loader : xt('style', 'css?minimize') },
			{ test : /\.less$/, loader : xt('style', 'css?modules&minimize&importLoaders=1!autoprefixer?browsers=last 2 version!less-loader') },
			{ test : /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/, loader : 'url-loader?limit=8192' },
			{ test : /\.(gif|jpg|jpeg|png)(\?]?.*)?$/, loader : 'url-loader?limit=1024' }
		],
	},

	plugins : [
		new Webpack.DefinePlugin({ 'process.env' : { 'NODE_ENV' : '"production"' } }),
		new Webpack.optimize.OccurenceOrderPlugin(),
		new Webpack.optimize.UglifyJsPlugin({ compressor : { warnings : false } }),
		new ExtractTextPlugin('[name].css?[hash]', { allChunks : true }),
		new HtmlWebpackPlugin({ filename : 'index.html', template : 'index.html' })
	],

};
