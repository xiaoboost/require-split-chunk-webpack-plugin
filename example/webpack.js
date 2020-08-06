const Webpack = require('webpack');

const { RequireSplitChunkPlugin } = require('../dist');

const path = require('path');

const resolveRoot = (...paths) => path.resolve(__dirname, '..', ...paths);

const baseConfig = {
    mode: 'none',
    entry: {
        entry1: resolveRoot('example/entry1.js'),
        entry2: resolveRoot('example/entry2.js'),
    },
    target: 'node',
    output: {
        path: resolveRoot('example'),
        publicPath: '../',
        filename: 'output/[name].js',
        chunkFilename: 'output/[name].js',
        // libraryTarget: 'commonjs2',
    },
    optimization: {
        splitChunks: {
            maxInitialRequests: Infinity,
            minSize: 0,
            minChunks: 1,
            name: true,
            cacheGroups: {
                commons: {
                    test: /[\\/]common[\\/]/,
                    name: 'common',
                    chunks: 'all',
                },
            },
        },
    },
    plugins: [
        new Webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 6,
        }),
        new RequireSplitChunkPlugin(),
    ],
};

Webpack(baseConfig, (err, stats) => {
    if (err) {
        throw err;
    }

    console.log(stats.toString({
        chunks: false,
        chunkModules: false,
        chunkOrigins: false,
        colors: true,
        modules: false,
        children: false,
    }));
});
