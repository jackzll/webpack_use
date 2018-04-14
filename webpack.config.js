// webpack 命令行的几种基本命令

// $ webpack // 最基本的启动webpack方法
// $ webpack -w // 提供watch方法，实时进行打包更新
// $ webpack -p // 对打包后的文件进行压缩，提供production
// $ webpack -d // 提供source map，方便调试。
// 使用 extract-text-webpack-plugin就可以把css从js中独立抽离出来
var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// var extractCSS = new ExtractTextPlugin('./css/[name].css?[hash]');
var CleanPlugin = require("clean-webpack-plugin");
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');

//定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
process.env.NODE_ENV='development';
console.log(process.env.NODE_ENV);
var DEBUG = process.env.NODE_ENV !== 'production' ? true : false;
console.log(DEBUG);
var hrm = ['webpack-hot-middleware/client?reload=true','react-hot-loader/patch','webpack/hot/only-dev-server','babel-polyfill']
module.exports = {
    //要启用source-map需加上此配置项，同时css或less的loader要加上参数?sourceMap，js的loader不用加
    // devtool: 'source-map',
    //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
    entry: {
        // client:['webpack-dev-server/client?http://localhost:3000'],
        index: [...hrm, './app/page/index/index.js'],
        order: [...hrm, './app/page/order/order.js']
       
        // vendor: ['react'],
    },
    //输出的文件名 合并以后的js会命名为bundle.js
    output: {
        // publicPath:ROOT_PATH,
        path: path.resolve(__dirname, 'dist'),
        // filename: '[name]-[hash:5].js'
        filename: '[name].js'

    },
    cache: false,
    devtool: "source-map",  
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    },
                    {
                        loader: 'postcss-loader',
                    },
                    {
                        loader: "less-loader"
                    }],
                    // use style-loader in development 
                    fallback: "style-loader"
                })
            }
            ,
            //处理sass
            {
                test: /\.scss$/,
                use:ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                            loader: "css-loader",
                            options: {
                                modules: true,
                                sourceMap: true,
                                minimize: true, //压缩
                                localIdentName: '[local]--[hash:base64:5]',
                                
                            }
                        },
                        {
                            loader: 'postcss-loader',
                        },
                        {
                            loader: "sass-loader" // compiles Sass to CSS 
                        }

                    ]
                })
            },
            //.css文件使用style-loader和css-loader来处理
            {
                test: /\.css$/,
                use:ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                            loader: 'css-loader',
                            options: {
                                modules:true ,
                                sourceMap: true,
                                minimize: true, //压缩
                                localIdentName: '[local]--[hash:base64:5]',

                            }
                        },
                        {
                            loader: 'postcss-loader',
                        }
                    ]
                })
            },
            {
                test: /\.(jsx|js)$/i,
                exclude: /(node_modules)/,
                include: path.join(__dirname, 'app'),
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['es2015', {
                                modules:false
                            }], 'stage-1', 'react'
                        ],
                        plugins: ['react-hot-loader/babel',["import", { libraryName: "antd", style: true }]]
                    }
                }]

            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ]


    },
    resolve: {
        //用于指明程序自动补全识别哪些后缀，注意一下，extensions 第一个是空字符串，对应不需要后缀的情况。
        extensions: ['.js', '.jsx', '.css', '.scss'],
        // alias:{
        //   'jquery':path.resolve(__dirname, 'app/lib/jquery.min.js'),
        // },
    },
    // externals对象的key是给require时用的，比如require('react')，对象的value表示的是如何在global（即window）中访问到该对象，这里是window.React。
    externals: {
        "jquery": "jQuery"
    },
    //添加我们的插件 会自动生成一个html文件
    plugins: [
        // new CleanPlugin(['./dist/']), //删除文件夹
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new HtmlwebpackPlugin({
            title: 'order',
            filename: 'order.html',
            template: path.resolve(__dirname,'./app/page/order/order.html'),
            inject: 'body',
            chunks: ['order'],
            cache: false,
            hash:false
        }),
        new HtmlwebpackPlugin({
            title: 'index',
            filename: 'index.html',
            template: path.resolve(__dirname,'./app/page/index/index.html'),
            inject: 'body',
            chunks: ['index'],
            cache: false,
            hash:false
        }),
        new ExtractTextPlugin({
            // filename: '[name]-min-[hash].css',
            filename: '[name].css',
            allChunks: true,
            disable:DEBUG,//开发环境禁用

        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV:JSON.stringify('development')//'production'
            }
        })
        // new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' }),

        // new webpack.optimize.UglifyJsPlugin({生产环境使用
        //         compress: {
        //             warnings: false
        //         }
        //     })
    ],
    // devServer: {
    //     // hot:true,
    //     // inline:true,
    //     port:8081,
    //     contentBase: path.join(__dirname, "dist"),
    //     // publicPath:ROOT_PATH,
    //     historyApiFallback:true,
    //     clientLogLevel: "none",
    //     // inline:true,

    //     headers: { 'Access-Control-Allow-Origin': '*' },
    //     overlay: {
    //         warnings: true,
    //         errors: true
    //     },
    //     stats: "errors-only"
    // }
};