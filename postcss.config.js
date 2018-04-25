const currentTarget = process.env.npm_lifecycle_event;
console.log('postcss_npm run : '+currentTarget);
console.log('postcss_process.env.WEBPACK_MODE : '+process.env.WEBPACK_MODE+'\n');
module.exports = {
	plugins: {
		'postcss-import': {},
		'postcss-cssnext': {},
		//'cssnano': {} 压缩css

	}
};

if (currentTarget == 'build') {
		module.exports.plugins.cssnano = {};
	}
//process.env.WEBPACK_MODE : mode的值：development或者production
//process.env.npm_lifecycle_event npm run xxx中的xxx