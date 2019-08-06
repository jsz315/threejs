const merge = require("webpack-merge");
const webpack = require('webpack');
const http = require('./config/http');

function getConfig(){
    const baseConfig = require("./webpack.base");
    const config = merge(baseConfig, {
        // Provides process.env.NODE_ENV with value development. Enables NamedChunksPlugin and NamedModulesPlugin.
        mode: 'development',
        // 开启调试模式
        devtool: "cheap-module-eval-source-map",
        plugins: [
            new webpack.DefinePlugin({
                PATH: http.dev.PATH,
                MOCK: http.dev.MOCK,
                PROXY: http.dev.PROXY
            }),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
        ]
    });
    config.entry.index.push('webpack-hot-middleware/client');
    if(config.entry.vendor){
        config.entry.vendor.push('webpack-hot-middleware/client');
    }
    else{
        config.entry.vendor = ['webpack-hot-middleware/client'];
    }
    return config;
}
module.exports = getConfig;