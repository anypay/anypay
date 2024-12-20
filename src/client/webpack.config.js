const path = require('path')

module.exports = {
	target:'web',
	entry:{
		index: './src/index.ts'
	},
	output: {
		path: path.resolve(__dirname, '/dist'),
		filename: 'index.js',
		library: 'anypay',
		libraryTarget: 'umd',
		globalObject:'this',
		umdNamedDefine:true
	}

}
