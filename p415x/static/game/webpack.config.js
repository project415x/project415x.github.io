var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  resolveLoader: {
		moduleExtensions: ['-loader']
	},  
	module: {
				loaders: [
				{
					loader: 'json-loader',
					test: /\.json$/
				},
				{
					test: /\.js?$/,
					exclude: /(node_modules|bower_components)/,
					loader: 'babel', // 'babel-loader' is also a legal name to reference
					query: {
							presets: ['es2015'],
							cacheDirectory: true
							}
				},
				{
					test: /\.scss$/,
					loaders: ['style', 'css', 'sass']
				},
				{
					test: /\.css$/,
					loaders: ['style', 'css', 'sass']
				}, { 
					test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
					loader: 'file-loader?name=fonts/[name].[ext]'
				},
					{ test: /\.png$/, loader: "file-loader" },
					{ test: /\.gif$/, loader: "file-loader" },
					{ test: /\.jpg$/, loader: "file-loader" }
			]
    },
		node: {
			fs: "empty"
		},
    context: __dirname,
    plugins: [
        new BundleTracker({ filename: './webpack-stats.json'})
    ],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js",
    },
    devtool: 'eval-cheap-source-map'
}
