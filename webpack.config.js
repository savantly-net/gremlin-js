var path = require('path');
const _ = require('lodash');
const CopyPkgJsonPlugin = require('copy-pkg-json-webpack-plugin/dist');

const pkgPlugin = new CopyPkgJsonPlugin({
    remove: ['devDependencies', 'scripts'],
    replace: {
    	module: "gremlin.es6.js",
    	main: "gremlin.umd.js"
    }
});


const config = {
	devtool : "source-map",
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
				enforce : "pre",
				test : /\.(t|j)sx?$/,
				loader : "source-map-loader"
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
    name: "es2015",
	entry : './public_api.ts',
    output: {
    	path : path.resolve(__dirname, 'dist'),
		filename: "gremlin.es6.js"
    },
    plugins: [ pkgPlugin ],
    module: {
    	rules: [
    		{
    			test: /\.ts$/,
    			use : {
    				loader : 'awesome-typescript-loader',
    				options: {
    			        configFileName: 'src/tsconfig.es6.json'
    			    },
    			},
    			exclude: [ /node_modules/, '**/*.spec.ts' ]
    		}
    	]
    }
});
console.debug(es6Config);

const umdConfig = _.assign({}, config, {
    name: "umd",
	entry : './public_api.ts',
    output: {
    	path : path.resolve(__dirname, 'dist'),
		libraryTarget: 'umd',
		library: "gremlinjs",
		filename: "gremlin.umd.js"
    },
    module: {
    	rules: [
    		{
    			test: /\.ts$/,
    			use : {
    				loader : 'awesome-typescript-loader'
    			},
    			exclude: [ /node_modules/, '**/*.spec.ts' ]
    		}
    	]
    }
});
console.debug(umdConfig);


// Return Array of Configurations
module.exports = [
    umdConfig, es6Config  	
];
