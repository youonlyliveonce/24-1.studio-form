var config = require('../config')
if(!config.tasks.js) return

var path            = require('path')
var webpack         = require('webpack')
var autoprefixer    = require('autoprefixer')

// var ExtractTextPlugin = require('extract-text-webpack-plugin')

var webpackManifest = require('./webpackManifest')
var webpackFavicons = require('./webpackFavicons')

process.noDeprecation = true

module.exports = function(env) {
	var mode = config.root.mode;
	var jsSrc = path.resolve(config.root[mode].src, config.tasks.js.src)
	var jsDest = path.resolve(config.root[mode].dest, config.tasks.js.dest)
	var publicPath = path.join(config.tasks.js.dest, '/')

	var faviconsSrc = path.resolve(config.root[mode].src + "/favicons/favicon.png")
	var faviconsDest = path.resolve(config.root[mode].src + "/assets/favicons")

	// var extractStyles = new ExtractTextPlugin('[name].css')
	// var extractHtml = new ExtractTextPlugin('[name].html')

	var filenamePattern = '[name].js'
	var extensions = config.tasks.js.extensions.map(function(extension) {
		return '.' + extension
	})

	var webpackConfig = {
		context: jsSrc,
		plugins: [],
		resolve: {
			modules: [
				path.join(__dirname, "src"),
				"node_modules"
			],
			alias: {
				webworkify: 'webworkify-webpack',
				'TweenMax': path.resolve('./src/javascript/vendor/gsap/uncompressed/TweenMax.js'),
				'ScrollToPlugin': path.resolve('./node_modules/gsap/src/uncompressed/plugins/ScrollToPlugin.js')
			}
		},
		module: {
			rules: [
				{
					test: /\.jsx$/,
					enforce: "pre",
					loader: "eslint-loader",
					options: {
						presets: ['es2015', 'stage-0']
					}
				},
				{
					test: /\.modernizrrc.js$/,
					loader: "modernizr"
				},
				{
					test: /\.js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['es2015', 'stage-0']
						}
					}
				}
			],
			noParse: /(mapbox-gl)\.js$/
		}
	}

	webpackConfig.entry = config.tasks.js.entries

	// webpackConfig.entry = {
	//  index: [
	// 	 path.resolve(__dirname, 'templates/index.pug')
	//  ],
	//  post: [
	// 	 path.resolve(__dirname, 'templates/post.pug')
	//  ],
	//  'css/application': [
	// 	 path.resolve(__dirname, 'assets/styles/application.scss')
	//  ]
	// }

	webpackConfig.output= {
		path: path.normalize(jsDest),
		filename: filenamePattern,
		publicPath: publicPath
	}

	if(config.tasks.js.extractSharedJs) {
		webpackConfig.plugins.push(
			new webpack.optimize.CommonsChunkPlugin({
				name: 'shared',
				filename: filenamePattern,
			})
		)
	}

	if(env === 'development') {
		webpackConfig.devtool = 'source-map'
		webpackConfig.plugins.push(
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false,
					minimize: true,
					drop_console: false,
				}
			}),
			new webpack.LoaderOptionsPlugin({
				minimize: false,
				debug: true,
				options: {
					postcss: [
						autoprefixer({
							browsers: ['last 5 version', 'Explorer >= 10', 'Android >= 4']
						})
					],
					sassLoader: {
						includePaths: [
							path.resolve(__dirname, 'node_modules/sanitize.css/')
						]
					}
				}
			})
		)

	}


	if(env === 'production') {
		webpackConfig.plugins.push(
			new webpackManifest(publicPath, config.root[mode].dest),
			new webpackFavicons(faviconsSrc, faviconsDest, config.root),
			new webpack.DefinePlugin({
				'process.env': {
					'NODE_ENV': JSON.stringify('production')
				}
			}),
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.UglifyJsPlugin(),
			new webpack.NoErrorsPlugin()
		)
	}


	return webpackConfig
}
