var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var compiler = webpack(webpackConfig);
var webpackHotMiddleware=require("webpack-hot-middleware");
 var express=require('express');
 var app=express();
app.use(require("webpack-dev-middleware")(compiler, {
    noInfo:true, 
    publicPath: webpackConfig.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));
app.listen(3000,function(){
	console.log(`port----3000`);
})