const webpack = require('webpack');

module.exports = {
    devtool: 'eval-source-map',
    entry:  __dirname + "/src/iplayer.js",
    output: {
        path: __dirname + "/dist",
        filename: "iplayer.js"
    },
    devServer: {
        port:80,
        inline: true
    },
    module:{
        rules:[{
            test:/\.css$/,
            use: ['style-loader', 'css-loader'],
        }]
    },
    plugins: [
        //new webpack.optimize.UglifyJsPlugin()
    ]

}
