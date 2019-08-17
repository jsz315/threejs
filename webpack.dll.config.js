const path = require('path')
const webpack = require('webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
    entry: {
        three: ['three']
    },
    output: {
        filename: '[name].dll.[hash:8].js',
        path: path.join(__dirname, 'dist/dll'),
        library: '_dll_[name]_[hash:8]'
    },
    plugins: [
        new CleanWebpackPlugin({
            root: path.resolve(__dirname, 'dist/dll'),
            verbose: true,
            dry: false
        }),
        new webpack.DllPlugin({
            name: '_dll_[name]_[hash:8]',
            path: path.join(__dirname, './dist/dll/[name].manifest.json')
        }),
        new BundleAnalyzerPlugin()
    ]
}