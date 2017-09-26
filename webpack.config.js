const path = require('path')
const outputLocation = process.env.NODE_ENV == 'production'
	? '/'
	: '/build'
const devtool = process.env.NODE_ENV == 'production'
	? false
	: 'source-map'

module.exports = function (source) {
	const config = {
		// input
		entry: './main.js',

		// input
		output: {
			path: path.join(__dirname, outputLocation),
			filename: 'bundle.js'
		},

		// transformations
		module: {
			rules: [
				{
					test: /\.jsx?$/,
					use: ["babel-loader"]
				},
				{
					test: /\.css$/,
					use: [
						"style-loader",
						"decss-loader/preact",
						{
							loader: "css-loader",
							options: { modules: true, importLoaders: 1, localIdentName: '[local]-[hash:base64:5]' }
						},
				    // "postcss-loader"
					]
				}
			],
		},

		// sourcemaps
		devtool: devtool,

		// server
		devServer: {
			contentBase: path.join(__dirname, 'public'),
			compress: true,
			historyApiFallback: true,
			allowedHosts: ['localhost', '0.0.0.0'],
			port: 3000
		}
	}

	return config
}
