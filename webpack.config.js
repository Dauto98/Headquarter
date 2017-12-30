const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry : './public/js/app.module.js',
	output : {
		filename : 'dist/bundle.js',
		path : path.resolve(__dirname, './public'),
	},
	devtool : 'inline-source-map',
	module : {
		rules : [
			{
				test : /\.html$/,
				use : [
					'html-loader'
				]
			},
			{
				test : /\.css$/,
				use : [
					{loader : 'style-loader'},
					{
						loader : 'css-loader',
						options : {
							modules : true,
							sourceMap : true
						}
					}
				]
			}
		]
	},
	plugins : [
		new HtmlWebpackPlugin({
			inject : true,
			template : path.resolve(__dirname, './public/index.html'),
			filename : path.resolve(__dirname, './public/dist/index.html'),
		}),
		new CleanWebpackPlugin(path.resolve(__dirname, './public/dist'))
	]
}
