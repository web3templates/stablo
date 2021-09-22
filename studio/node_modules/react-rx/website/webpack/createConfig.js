const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = function createConfig(env) {
  return {
    mode: env,
    entry: './src/entries/main.tsx',
    output: {
      path: path.resolve(__dirname, '..', 'public'),
      filename: '[name]-[hash].js'
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
      new CleanWebpackPlugin(),
      env === 'development' && new webpack.ProgressPlugin(),
      new CopyPlugin({
        patterns: ['a', 'b'].map((n) => ({
          from: `src/examples/fetch/${n}.txt`,
          to: `${n}.txt`
        }))
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        inject: true
      })
    ].filter(Boolean),
    node: {
      global: true,
      fs: 'empty',
      __filename: 'mock',
      __dirname: 'mock'
    },
    module: {
      rules: [
        {
          test: /\.([tj])sx?$/,
          use: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.mdx?$/,
          use: ['babel-loader', path.resolve(__dirname, './mdx-toc-loader.js')]
        },
        {
          test: /\.html$/,
          use: 'html-loader'
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    ...(env === 'development' && {
      devServer: {
        port: 3000,
        host: '0.0.0.0',
        historyApiFallback: true,
        disableHostCheck: true
      }
    }),
    devtool: env === 'development' ? 'source-map' : false,
    ...(env === 'production' && {
      optimization: {
        usedExports: true,
        minimize: true,
        splitChunks: {
          chunks: 'async',
          minSize: 30000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 6,
          maxInitialRequests: 4,
          automaticNameDelimiter: '~',
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
            }
          }
        }
      }
    })
  }
}
