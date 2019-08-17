const merge = require("webpack-merge");
const webpack = require('webpack');
const http = require('./config/http');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function getConfig(){
    const baseConfig = require("./webpack.base");
    const config = merge(baseConfig, {
        // Provides process.env.NODE_ENV with value development. Enables NamedChunksPlugin and NamedModulesPlugin.
        mode: 'production',
        // 开启调试模式
        devtool: "cheap-module-source-map",
        plugins: [
            new BundleAnalyzerPlugin()
        ]
    });
    return config;
}
module.exports = getConfig;