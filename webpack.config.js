const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	context : path.resolve(__dirname),
	entry : './public/js/app.module.js',
	output : {
		filename : 'bundle.js',
		path : path.resolve(__dirname, './public/dist'),
		publicPath :	'./dist/'
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
			},
			{
				test : /\.(woff|woff2|eot|ttf|otf)$/,
				use : [
					{
						loader : 'file-loader',
						options : {
							outputPath : './assets/fonts/s',
						}
					}
				]
			},
			{
				test : /\.(png|svg|jpg|gif)$/,
				use : [
					{
						loader : 'file-loader',
						options : {
							outputPath : './assets/images/',
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
		new CleanWebpackPlugin(path.resolve(__dirname, './public/dist')),
		new webpack.ProvidePlugin({
	    $: "jquery",
	    jQuery: "jquery"
	  })
	]
}
