const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');


module.exports = {
	context : path.resolve(__dirname),
	entry : {
		main :	'./public/js/app.module.js'
	},
	output : {
		filename : '[name].[chunkhash].js',
		path : path.resolve(__dirname, './public/dist'),
		publicPath :	'/'
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
				use : ExtractTextPlugin.extract({
					fallback : 'style-loader',
					use : [
						{
							loader : 'css-loader',
							options : {
								modules : true,
								importLoaders : 1
							}
						},
						{
							loader : 'postcss-loader',
							options : {
								config : {
									ctx : {
										autoprefixer : {
											browsers : 'last 2 versions'
										}
									}
								}
							}
						}
					]
				}),
				exclude : [
					path.resolve(__dirname, './node_modules/')
				]
			},
			{
				test : /\.css$/,
				use : ExtractTextPlugin.extract({
					fallback : 'style-loader',
					use : [
						{
							loader : 'css-loader',
						}
					]
				}),
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
				test : /\.(svg|gif)$/,
				use : [
					{
						loader : 'file-loader',
						options : {
							outputPath : './assets/images/',
						}
					}
				]
			},
			{
				test: /\.(jpe?g|png)$/i,
				loader: 'responsive-loader',
				options: {
					sizes: [360, 800, 1200, 1400],
					placeholder: true,
					adapter: require('responsive-loader/sharp'),
					name: './assets/images/[hash]-[width].[ext]'
				}
		 }
		]
	},
	plugins : [
		new ExtractTextPlugin({
			filename : 'styles.[contenthash].css',
			allChunks : true
		}),
		new HtmlWebpackPlugin({
			inject : true,
			template : path.resolve(__dirname, './public/index.html'),
			filename : path.resolve(__dirname, './public/dist/index.html'),
		}),
		new CleanWebpackPlugin(path.resolve(__dirname, './public/dist')),
		new UglifyJsPlugin({
			sourceMap : true,
			cache : true
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names : ['vendor', 'runtime']
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			auth0 : "auth0-js"
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
