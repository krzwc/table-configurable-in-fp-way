const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            common: path.resolve(__dirname, 'src/common/'),
            components: path.resolve(__dirname, 'src/components/'),
            pages: path.resolve(__dirname, 'src/pages/'),
            wrappers: path.resolve(__dirname, 'src/wrappers/'),
        }
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        port: 3000,
    },
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
    }, 
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: ['babel-loader'],
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [{ loader: 'ts-loader' }],
            },
            {
                test: /\.css$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
            },
            {
                test: /\.(png|svg|jpg|gif)$/i,
                use: ['file-loader'],
            },
        ],
    },
    devtool: 'eval-cheap-module-source-map',
    plugins: [
        new ESLintPlugin(), 
    ],
};
