var path = require('path');
var entries = require('./entry.json');
var Webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var PORT = 3000;
var ASSETS_PATH = path.resolve(__dirname, 'build');
var SERVER_URL = 'http://localhost:' + PORT;

// region HELPER FUNCTIONS
function map(obj, callback) {
	var result = {};
	Object.keys(obj).forEach(function (key) {
		result[key] = callback.call(obj, obj[key], key, obj);
	});
	return result;
}
// endregion

module.exports = {

	debug   : true,
	devtool : 'eval-source-map',

	entry : map(entries, function (entry) { return [
		entry,
		'webpack-dev-server/client?' + SERVER_URL,
		'webpack/hot/only-dev-server'
	]}),

	output : {
		path       : ASSETS_PATH,
		filename   : '[name].js',
		publicPath : SERVER_URL + '/'
	},

	module : {
		loaders : [
			{ test : /\.js$/, loader : 'react-hot!babel', exclude : /node_modules/ },
			{ test : /\.css$/, loader : 'style!css?sourceMap' },
			{ test : /\.less$/, loader : 'style!css?sourceMap&modules&localIdentName=[name]__[local]&importLoaders=1!autoprefixer?browsers=last 2 version!less-loader?sourceMap' },
			{ test : /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/, loader : 'url-loader?limit=8192' },
			{ test : /\.(gif|jpg|jpeg|png)(\?]?.*)?$/, loader : 'url-loader?limit=1024' }
		],
	},

	plugins : [
		new Webpack.NoErrorsPlugin(),
		new Webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({ filename : 'index.html', template : 'index.html' })
	],

	devServer : {
		port               : PORT,
		contentBase        : ASSETS_PATH,
		hot                : true,
		quiet              : false,
		noInfo             : true,
		inline             : true,
		colors             : true,
		historyApiFallback : true
	}

};
