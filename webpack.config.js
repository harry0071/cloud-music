const path = require('path');
const webpack = require('webpack'); // 用于访问内置插件
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const currentTarget = process.env.npm_lifecycle_event;//获取npm run xxx

console.log('npm run : '+currentTarget);
console.log('process.env.WEBPACK_MODE : '+process.env.WEBPACK_MODE+'\n');

module.exports = {
	entry: './src/entry.js',
	output: {
		filename: 'main.min.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [{
				test: /\.js$/, //以.js结尾的文件
				exclude: /(node_modules|bower_components)/, //排除
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [{
						loader: 'css-loader',
						options: {
							importLoaders: 1
						}
					}, 'postcss-loader', 'sass-loader'],
					publicPath: "/dist"
				})
			}
			//['style-loader','css-loader','sass-loader']
			, {
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [{
						loader: 'css-loader',
						options: {
							importLoaders: 1
						}
					}, 'postcss-loader'],
					publicPath: "/dist"
				})
			}, {
				test: /\.less$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [{
						loader: 'css-loader',
						options: {
							importLoaders: 1
						}
					}, 'postcss-loader', 'less-loader'],
					publicPath: "/dist"
				})
			}
		]

	},
	plugins: [
		new ExtractTextPlugin({
			filename: 'style.css',
			disable: currentTarget == "start"
		}),
		new webpack.HotModuleReplacementPlugin(),
		//new webpack.NamedModulesPlugin() 查看哪个模块有更新
	],
	devServer: {
		contentBase: './dist',
		inline: true,
		hot: true,
		compress: true,
		port: 9000,
		host: "127.0.0.1"
	}
};