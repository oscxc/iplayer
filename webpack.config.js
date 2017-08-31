const webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry:  __dirname + "/src/entry.js",
    output: {
        path: __dirname + "/dist",
        filename: "app.js"
    },
    devServer: {
        port:80,
        inline: true
    },
    // module:{
    //     rules:[{
    //         test:/\.css$/,
    //         use: ['style-loader', 'css-loader'],
    //     }]
    // },
    plugins: [
        //new webpack.optimize.UglifyJsPlugin()
    ]

}
