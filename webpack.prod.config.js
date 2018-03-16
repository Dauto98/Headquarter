const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const NameAllModulesPlugin = require("name-all-modules-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");

/**
 * check if the modules is from 3rd party
 */
function isExternal(module) {
	var context = module.context;

	if (typeof context !== "string") {
		return false;
	}

	return context.indexOf("node_modules") !== -1;
}

module.exports = {
	context : path.resolve(__dirname),
	entry : {
		main :	"./public/index.js"
	},
	output : {
		filename : "[name].[chunkhash].js",
		path : path.resolve(__dirname, "./public/dist"),
		publicPath :	"/"
	},
	module : {
		rules : [
			{
				test : /\.js$/,
				exclude : /node_modules/,
				use : ["babel-loader"]
			},
			{
				test : /\.css$/,
				use : ExtractTextPlugin.extract({
					fallback : "style-loader",
					use : [
						{
							loader : "css-loader",
							options : {
								modules : true,
								importLoaders : 1,
								camelCase : true,
							}
						},
						{
							loader : "postcss-loader",
							options : {
								config : {
									ctx : {
										autoprefixer : {
											browsers : "last 2 versions"
										}
									}
								}
							}
						}
					]
				}),
				exclude : /node_modules(?!\/react-toolbox)/
			},
			{
				test : /\.(woff|woff2|eot|ttf|otf)$/,
				use : [
					{
						loader : "file-loader",
						options : {
							outputPath : "./assets/fonts/",
						}
					}
				]
			},
			{
				test : /\.(svg|gif)$/,
				use : [
					{
						loader : "file-loader",
						options : {
							outputPath : "./assets/images/",
						}
					}
				]
			},
			{
				test: /\.(jpe?g|png)$/i,
				loader: "responsive-loader",
				options: {
					sizes: [360, 800, 1200, 1400],
					placeholder: true,
					adapter: require("responsive-loader/sharp"),
					name: "./assets/images/[hash]-[width].[ext]"
				}
			}
		]
	},
	plugins : [
		new CleanWebpackPlugin(path.resolve(__dirname, "./public/dist")),
		new ExtractTextPlugin({
			filename : "styles.[contenthash].css",
			allChunks : true
		}),
		new UglifyJsPlugin({
			cache : true
		}),
		new webpack.NamedChunksPlugin(),
		new webpack.NamedModulesPlugin(),
		new NameAllModulesPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			names : ["vendor"],
			minChunks: (module) => isExternal(module)
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names : ["common"],
			chunks : ["main"],
			minChunks : (module, count) => !isExternal(module) && count > 1
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names : ["runtime"],
			minChunks : Infinity
		}),
		new HtmlWebpackPlugin({
			template : "./public/index.html",
			chunksSortNode : function orderEntryLast(a, b) {
				if (a.entry !== b.entry) {
					return b.entry ? 1 : -1;
				} else if (a.id.includes("vendor")) {
					return -1;
				} else if (b.id.includes("vendor")) {
					return 1;
				} else {
					return b.id - a.id;
				}
			}
		}),
		new webpack.ProvidePlugin({
			auth0 : "auth0-js"
		}),
		new webpack.DefinePlugin({
			"process.env.API_URL" 				 : JSON.stringify(process.env.API_URL),
			"process.env.auth_clientID" 	 : JSON.stringify(process.env.auth_clientID),
			"process.env.auth_domain" 		 : JSON.stringify(process.env.auth_domain),
			"process.env.auth_audience" 	 : JSON.stringify(process.env.auth_audience),
			"process.env.auth_redirectUri" : JSON.stringify(process.env.auth_redirectUri),
			"process.env.NODE_ENV" 				 : JSON.stringify("production")
		})
	]
};
