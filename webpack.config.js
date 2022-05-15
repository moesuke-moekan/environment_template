module.exports = {
    // production | development
    mode: process.env.MODE,

    entry: './src/js/main.js',
    output: {
        filename: '[name].js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env'
                            ]
                        }
                    }
                ]
            }
        ]
    }
};
