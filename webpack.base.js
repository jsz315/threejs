const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const global = require('./global')
const FilePlugin = require('./file-plugin')

console.log("配置文件");
console.log(global);

module.exports = {
    //指定入口文件
    entry: global.entry,
    //指定出口文件.打包生成build.js,如果没有dist文件夹会自动创建.最好写绝对路径，不然会报下图中的错误Invalid configuration object
    output: {
        path: path.join(__dirname, 'dist'), 
        filename: 'js/[name].[hash:4].js',
        publicPath: '',
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    //模块,指定加载器,可配置各种加载器,这样就不担心less等文件的编译问题，这里用不到所以没写
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                          hmr: true,
                        },
                    },
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                          hmr: true,
                        },
                    },
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg)?$/,
                loader: 'url-loader',
                include: [path.resolve('src'), path.resolve('static')],
                options: {
                    limit: 10000,
                    name: 'asset/img/[name].[ext]',
                    //图片最终请求的路径
                    publicPath: '../'
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },

    plugins: [
        new VueLoaderPlugin(),
        new FilePlugin({
            name: "自定义插件",
            pages: global.pages
        }),
        new CleanWebpackPlugin({
            root: path.resolve(__dirname, 'dist'),
            verbose: true,
            dry: false,
            exclude: ['dll'],
            cleanOnceBeforeBuildPatterns: ['!dll/*.*']
        }),
        new CopyWebpackPlugin([
            {
              from: path.resolve(__dirname, './static/js'),
              to: path.resolve(__dirname, 'dist/js'),
              ignore: ['.*']
            },
            ...global.copy
        ]),
        ...global.html,
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'css/[name].[hash:4].css'
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: path.join(__dirname, './dist/dll/three.manifest.json')
        }),
        new AddAssetHtmlPlugin([
            {
                filepath: path.resolve(__dirname, './dist/dll/*.js'),
                // 文件输出目录
                outputPath: 'dll',
                // 脚本或链接标记的公共路径
                publicPath: 'dll'
            }
        ])
    ]
};