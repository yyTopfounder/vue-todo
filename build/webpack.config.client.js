const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require("webpack-merge");
const ExtractPlugin = require('extract-text-webpack-plugin');
const baseConfig = require("./webpack.config.base");

const isDev = process.env.NODE_ENV === 'development';

let config;
let devServer = {
    port: 8000,
    host: '0.0.0.0',
    overlay: {
      errors: true,
    },
    hot: true
};
let defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  new HTMLPlugin()
];

if (isDev) {
  config = merge(baseConfig,{
    devtool:"#cheap-module-eval-source-map",
    devServer,
    module:{
      rules:[
        {
          test: /\.styl/,
          use: [
            'vue-style-loader',//不适用style-loader是因为其没有样式热更替功能
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
              }
            },
            'stylus-loader'
          ]
        }
      ]
    },
    plugins:defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ])
  });
} else {
  config = merge(baseConfig,{
    entry:{
      app: path.join(__dirname, '../src/index.js'),
      vendor: ['vue']
    },
    output:{
      filename:'[name].[chunkhash:8].js',
    },
    module:{
      rules:[
        {
          test: /\.styl/,
          use: ExtractPlugin.extract({
            fallback: 'vue-style-loader',
            use: [
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                }
              },
              'stylus-loader'
            ]
          })
        },
      ]
    },
    plugins:defaultPlugins.concat([
      new ExtractPlugin('styles.[contentHash:8].css'),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'runtime'
      })
    ])
  });
}

module.exports = config;
