var htmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');
var jquery = require('jquery')
var path = require('path')
var webpack = require('webpack');
var SpritesmithPlugin = require('webpack-spritesmith');
var CopyWebpackPlugin=require('copy-webpack-plugin')
module.exports = {
    entry: {
        app: './src/app.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[hash].js'

    },
    module: {
        rules: [
            {
                test: /\.js/,
                // enforce: "pre",
                loader: 'babel-loader',
                include: __dirname + '/src',
            },
            {
                test: /\.html$/,
                loader: 'html-loader'

            },
            {
                test: /\.pug$/,
                loader: 'pug-loader',
                options:{
                    pretty:true
                }

            },
            {
                test: /\.styl(us)?$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                            },
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: function () {
                                    return [
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        },
                        {
                            loader: 'stylus-loader'
                        },
                    ],
                    fallback: 'style-loader',
                }),
            },
         
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    'url-loader?limit=20&name=assets/img/[name].[ext]?v=[hash:7]'
                ],
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.pug',
            inject: 'body',
            minify: false,
            hash:true
        }),
        new CleanWebpackPlugin(['dist']),
        new ExtractTextPlugin({
            filename: '/css/[name].css',
            disable: false,
            allChunks: true,
        }),
        new webpack.ProvidePlugin({

            $: "jquery",

            jQuery: "jquery",

            "window.jQuery": "jquery"

        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //         screw_ie8: true,
        //         conditionals: true,
        //         unused: true,
        //         comparisons: true,
        //         sequences: true,
        //         dead_code: true,
        //         evaluate: true,
        //         if_return: true,
        //         join_vars: true
        //     },
        //     output: {
        //         comments: false
        //     }
        // }),
       
        //抽取公共代码 或者引入的js
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'js/vendor.[hash].js',
            minChunks(module) {
                return module.context &&
                    module.context.indexOf('node_modules') >= 0;
            }
        })
        ,
        new CopyWebpackPlugin([{
            from: __dirname + '/src/js/source',
            to:__dirname + '/dist/js/source',
        }]),
        new SpritesmithPlugin({
            // 目标小图标
            src: {
                cwd: path.resolve(__dirname, './src/images/'),
                glob: '*.png'
            },
            // 输出雪碧图文件及样式文件
            target: {
                image: path.resolve(__dirname, './sprite.png'),
                css: path.resolve(__dirname, './sprite.css')
            },
            // 样式文件中调用雪碧图地址写法
            apiOptions: {
                cssImageRef: './sprite.png'
            },
            spritesmithOptions: {
                algorithm: 'top-down'
            }
        })

    ],
    devServer: {
        hot: true,
        inline: true,
        open: true
    }

}