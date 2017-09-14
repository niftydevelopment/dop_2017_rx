const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

const root = path.resolve(__dirname);
const dist = path.join(root, "dist");

module.exports = {
    entry: {
        app: path.join(root, "src", "app.ts"),
        styles: path.join(root, "src", "app.css"),
    },
    module: {
        rules: [
            { 
                enforce: 'pre',
                test: /\.tsx?$/,
                use: [
                    {loader: 'tslint-loader'},
                ],
            },
            {
                test: /\.tsx?$/,
                use: [
                    {loader: "ts-loader"},
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                ],
            },
            { 
                test: /\.(png|gif|jpg|jpeg)$/,
                use: [{loader: "file-loader"}],
            },
        ],
    },
    output: {
        path: dist,
        filename: "[name].js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.join(root, "src", "index.ejs"),
        }),
    ],
};
