import nodeExternals from 'webpack-node-externals'
import {DefinePlugin} from "webpack";
import path from 'path'

const DIST_PATH = path.resolve(__dirname, 'dist')
const production = !process.env.NODE_ENV || process.env.NODE_ENV === 'production'
const development = process.env.NODE_ENV === 'development'

//console.log(`Production: ${production}`)
//console.log(`Development: ${development}`)

const getConfig = target => ({
    name: target,
    mode: development ? 'development' : 'production',
    target: "node",
    entry:  `./src/index.ts`,
    stats: 'minimal',
    //devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        caller: { target },
                    },
                },
            },
        ],
    },

    resolve: {
        extensions: ['.ts', '.js'],
    },

    optimization: {
        moduleIds: 'natural',
        chunkIds: 'natural',
        minimize: false,
    },
    externals:
        undefined,
        //target === 'node' ? [nodeExternals()] : undefined,
    output: {
        path: DIST_PATH,
        filename: `index.js`,
        publicPath: `/`,
        libraryTarget: target === 'node' ? 'commonjs2' : undefined,
    },
    plugins: [
        new DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}),
    ],
})

export default [getConfig('node')]
