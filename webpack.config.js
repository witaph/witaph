var path = require('path');
var HtmlWebpackPlugin =  require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry : './app/index.js',
    output : {
        path : path.resolve(__dirname , 'dist'),
        filename: 'index_bundle.js',
        publicPath: '/'
    },
    module : {
        rules : [
            {test : /\.(js)$/, use:'babel-loader'},
            {test : /\.css$/, use:['style-loader', 'css-loader']},
            {
                test : /\.(jpe?g|gif|png|svg)$/i,
                use: [{
                    loader: 'url-loader',
                    options: { limit: 10000 }
                }]
            }
        ]
    },
    mode:'development',
    devServer: {
        historyApiFallback: true
    },
    plugins : [
        new HtmlWebpackPlugin ({
            template : 'app/index.html'
        }),
        new CopyWebpackPlugin ({
            patterns: [
                { from: 'public' }
            ]
        })
    ]

}