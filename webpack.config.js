const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
	target: 'node',
	entry: './src/app.js',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
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
		new CleanWebpackPlugin()
	],
	externals: [nodeExternals()],
};
