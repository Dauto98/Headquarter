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
		publicPath :	'./'
	},
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
							sourceMap : false
						}
					}
				],
				exclude : [
					path.resolve(__dirname, './node_modules/')
				]
			},
			{
				test : /\.css$/,
				use : [
					{loader : 'style-loader'},
					{
						loader : 'css-loader',
						options : {
							sourceMap : false
						}
					}
				],
				include : [
					path.resolve(__dirname, './node_modules/')
				]
			},
			{
				test : /\.(woff|woff2|eot|ttf|otf)$/,
				use : [
					{
						loader : 'file-loader',
						options : {
							outputPath : './assets/fonts/',
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
	  }),
		new webpack.DefinePlugin({
			'process.env.API_URL' 				 : JSON.stringify(process.env.API_URL),
			'process.env.auth_clientID' 	 : JSON.stringify(process.env.auth_clientID),
			'process.env.auth_domain' 		 : JSON.stringify(process.env.auth_domain),
			'process.env.auth_audience' 	 : JSON.stringify(process.env.auth_audience),
			'process.env.auth_redirectUri' : JSON.stringify(process.env.auth_redirectUri)
		})
	]
}
