var path = require('path');
const CopyPkgJsonPlugin = require('copy-pkg-json-webpack-plugin/dist');

const pkgPlugin = new CopyPkgJsonPlugin({
    remove: ['devDependencies', 'scripts'],
    replace: {main: 'gremlin.js'}}
);

module.exports = {
	entry : './public_api.ts',
	output : {
		path : path.resolve(__dirname, 'dist'),
		filename : 'gremlin.js',
		library: "gremlinjs"
	},
	resolve : {
		// changed from extensions: [".js", ".jsx"]
		extensions : [ ".ts", ".tsx", ".js", ".jsx" ],
        modules: ['node_modules']
	},
	module : {
		rules : [
			{
				test : /\.(t|j)sx?$/,
				use : {
					loader : 'awesome-typescript-loader'
				},
				exclude: [ /node_modules/, '**/*.spec.ts' ]
			},
			// addition - add source-map support 
			{
				enforce : "pre",
				test : /\.js$/,
				loader : "source-map-loader"
			}
		]
	},
	externals : {

	},
	// addition - add source-map support
	devtool : "source-map",
    node: {
        global: true,
        process: false,
        crypto: 'empty',
        module: false,
        clearImmediate: false,
        setImmediate: false
    },
    plugins: [
    	pkgPlugin
    ]
}