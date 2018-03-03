const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const NameAllModulesPlugin = require('name-all-modules-plugin');
const webpack = require('webpack');

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin({disable : !process.env.enableSpeedMeasure});

/**
 * check if the modules is from 3rd party
 */
function isExternal(module) {
  var context = module.context;

  if (typeof context !== 'string') {
    return false;
  }

  return context.indexOf('node_modules') !== -1;
}

module.exports = smp.wrap(((env) => {
	var config = {
		context : path.resolve(__dirname),
		entry : {
			main :	'./public/js/app.module.js'
		},
		output : {
			filename : '[name].[chunkhash].js',
			path : path.resolve(__dirname, './public/dist'),
			publicPath :	'/'
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
					use : ExtractTextPlugin.extract({
						fallback : 'style-loader',
						use : [
							{
								loader : 'css-loader',
								options : {
									modules : true,
									sourceMap : true,
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
								options : {
									sourceMap : true,
									importLoaders : 1
								}
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
				names : ['vendor'],
				minChunks: function(module) {
					return isExternal(module);
				}
			}),
			new webpack.optimize.CommonsChunkPlugin({
				names : ['runtime'],
				minChunks: Infinity
			}),
			new webpack.NamedChunksPlugin(),
			new webpack.NamedModulesPlugin(),
			new NameAllModulesPlugin(),
			new webpack.ProvidePlugin({
		    $: "jquery",
		    jQuery: "jquery",
				auth0 : "auth0-js"
		  }),
			new webpack.DefinePlugin({
				'process.env.API_URL' 				 : JSON.stringify("http://localhost:8000/api/"),
				'process.env.auth_clientID' 	 : JSON.stringify("kSw7C9eaMSfqtsMtDS6kKOjPSFftptKl"),
				'process.env.auth_domain' 		 : JSON.stringify("dauto98.auth0.com"),
				'process.env.auth_audience' 	 : JSON.stringify("https://headquarter-dauto98.herokuapp.com"),
				'process.env.auth_redirectUri' : JSON.stringify("http://localhost:8000/login_callback")
			})
		]
	}

	if (env && env.bundleanalyzer) {
		config.plugins.push(new BundleAnalyzerPlugin())
	}

	return config;
})())
