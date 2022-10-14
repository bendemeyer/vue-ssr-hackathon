const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = [{
	target: 'node',
	entry: './src/app-server.js',
	output: {
		path: path.join(__dirname, 'dist/server'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.vue$/i,
				use: 'vue-loader',
			},
			{
				test: /.css$/,
				use: 'null-loader',
			}
		]
	},
	optimization: {
	 	chunkIds: 'named',
	 	moduleIds: 'deterministic',
	 	concatenateModules: false,
	 	splitChunks: false,
	 	minimizer: [],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new VueLoaderPlugin(),
	],
	externals: [nodeExternals()],
},
{
	target: 'web',
	entry: './src/app-browser.js',
	output: {
		path: path.join(__dirname, 'dist/browser'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.vue$/i,
				use: 'vue-loader',
			},
			{
				test: /.css$/,
				use: [
				{
					loader: MiniCssExtractPlugin.loader,
				},
					'css-loader',
				]
			}
		]
	},
	optimization: {
	 	chunkIds: 'named',
	 	moduleIds: 'deterministic',
	 	concatenateModules: false,
	 	splitChunks: {
			chunks: 'all',
			minSize: 0,
			minChunks: 2,
			maxAsyncRequests: Infinity,
			maxInitialRequests: Infinity,
		},
	 	minimizer: [],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin(),
	],
}];
