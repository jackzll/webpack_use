var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// var extractCSS = new ExtractTextPlugin('./css/[name].css?[hash]');
var CleanPlugin = require("clean-webpack-plugin");
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var path = require('path');
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.join(ROOT_PATH, 'src');
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
var DEBUG = process.env.NODE_ENV === 'development';
//热更新
var devhrm = ['babel-polyfill'];
var devPlus = [new CleanPlugin('dist')];
var env = process.env.NODE_ENV;
if (DEBUG) {
    env = 'development';
    devhrm = ['webpack-hot-middleware/client?reload=true', 'react-hot-loader/patch', 'webpack/hot/only-dev-server', 'babel-polyfill'];
    devPlus = [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ];
}
module.exports = {
    entry: {
        index: [...devhrm, './src/entries/index/index.js'],
        order: [...devhrm, './src/entries/order/order.js'],
        lib: ['react', 'react-dom', 'antd']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        //用于指明程序自动补全识别哪些后缀，注意一下，extensions 第一个是空字符串，对应不需要后缀的情况。
        extensions: ['.js', '.jsx', '.css', '.scss'],
    },
    externals: {
        "jquery": "jQuery"
    },
    cache: false,
    devtool: "source-map",
    module: {
        rules: [{
                test: /\.less$/,
                include: [APP_PATH, path.resolve(ROOT_PATH, 'node_modules/antd')],
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: 'postcss-loader',
                    }, {
                        loader: "less-loader"
                    }],
                    // use style-loader in development 
                    fallback: "style-loader"
                })
            }, {
                test: /\.scss$/,
                include: [APP_PATH, path.resolve(ROOT_PATH, 'node_modules/antd')],
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                            loader: "css-loader",
                            options: {
                                modules: true,
                                sourceMap: DEBUG,
                                minimize: true, //压缩
                                localIdentName: '[local]--[hash:base64:5]',

                            }
                        }, {
                            loader: 'postcss-loader',
                        }, {
                            loader: "sass-loader"
                        }

                    ]
                })
            },
            //.css文件使用style-loader和css-loader来处理
            {
                test: /\.css$/,
                include: [path.resolve(ROOT_PATH, 'node_modules/antd')],
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: DEBUG,
                            minimize: false, //压缩
                            localIdentName: '[local]--[hash:base64:5]',

                        }
                    }, {
                        loader: 'postcss-loader',
                    }]
                })
            }, {
                test: /\.(jsx|js)$/i,
                exclude: /(node_modules)/,
                include: [APP_PATH],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "env", "react", "stage-1"
                        ],
                        plugins: ['react-hot-loader/babel', ["import", {
                            "libraryName": "antd",
                            "style": true
                        }]]
                    }
                }]

            }, {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ]
    },
    plugins: [
        ...devPlus,
        new HtmlwebpackPlugin({
            title: 'order',
            filename: 'order.html',
            template: path.resolve(__dirname, './src/entries/order/order.html'),
            inject: 'body',
            chunks: ['order'],
            cache: false,
            hash: false
        }),
        new HtmlwebpackPlugin({
            title: 'index',
            filename: 'index.html',
            template: path.resolve(__dirname, './src/entries/index/index.html'),
            inject: 'body',
            chunks: ['index'],
            cache: false,
            hash: false
        }),
        new ExtractTextPlugin({
            filename: '[name]-min-[hash].css',
            allChunks: true,
            disable: DEBUG, //开发环境禁用

        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(env) //'production'
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: 2,
            chunks: ['index', 'order'],
            filename: 'vendor.js'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'lib',
            chunks: ['lib'],
            minChunks: Infinity,
            filename: 'lib.js'
        })
    ]
}