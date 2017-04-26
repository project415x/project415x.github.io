/**
 * Modules
 */
var path = require('path'),
    webpack = require('webpack');

module.exports = {
    context: __dirname,
    node: {
        fs: 'empty'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            compress: {
                screw_ie8: true,
                warnings: false,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
                negate_iife: false
            },
            drop_console: true,
            mangle: false,
            output: {
                comments: false
            },
            sourceMap: false
        }),
        new webpack.optimize.DedupePlugin()
    ],
    module: {
        loaders: [
            {   test: /\.json$/, loader: 'json-loader' },
            {   test: /\.png$/, loader: "file-loader" },
            {   test: /\.gif$/, loader: "file-loader" },
            {   test: /\.jpg$/, loader: "file-loader" },
            {   test: /\.(scss|css)$/, loaders: ['style', 'css', 'sass'] },
            {   test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, 
                    loader: 'file-loader?name=fonts/[name].[ext]'
            },
            {   test: /\.js$/, 
                loader: "strip-loader?strip[]=console.log",
                exclude: /(node_modules)/
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015'],
                    cacheDirectory: true
                }
            }
        ]
    },
}

