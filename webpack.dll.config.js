var webpack = require('webpack');
var path = require('path');
var CleanPlugin = require("clean-webpack-plugin");
module.exports = {
    entry: ['react', 'react-dom', 'antd', 'lodash'],
    output: {
        path: path.resolve(__dirname, "src/lib/"),
        filename: "lib.js",
        library: "lib_[hash]"
    },
    plugins: [

        new webpack.DllPlugin({
            context: __dirname,
            name: "lib_[hash]",
            path: path.join(__dirname, "lib_manifest.json"),
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        })
    ]
}