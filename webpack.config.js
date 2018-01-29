var path = require('path');
const _ = require('lodash');
const CopyPkgJsonPlugin = require('copy-pkg-json-webpack-plugin/dist');

const pkgPlugin = new CopyPkgJsonPlugin({
    remove: ['devDependencies', 'scripts'],
    replace: {
    	module: "index.js",
    	main: "gremlin.umd.js"
    }
});


const config = {
	devtool : "inline-source-map",
	output : {
		path : path.resolve(__dirname, 'dist')
	},
	resolve : {
		extensions : [ ".ts", ".tsx", ".js", ".jsx" ],
        modules: ['node_modules']
	},
	module : {
		rules : [
			{
    			test: /\.ts$/,
    			use : {
    				loader : 'awesome-typescript-loader'
    			},
    			exclude: [ /node_modules/, '**/*.spec.ts' ]
    		}
		]
	},
    node: {
        global: true,
        process: false,
        crypto: 'empty',
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
}


const es6Config = _.assign({}, config, {
    name: "es6",
	entry : './index.ts',
    output: {
    	path : path.resolve(__dirname, 'dist'),
		filename: "gremlin.es6.js"
    },
    plugins: [ pkgPlugin ]
});

const umdConfig = _.assign({}, config, {
    name: "umd",
	entry : './index.ts',
    output: {
    	path : path.resolve(__dirname, 'dist'),
		libraryTarget: 'umd',
		library: "gremlinjs",
		filename: "gremlin.umd.js"
    }
});
console.debug(umdConfig);


// Return Array of Configurations
module.exports = [
    umdConfig, es6Config  	
];
