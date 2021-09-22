var path = require('path');

// currently, this is for bower
var config = {
  devtool: 'sourcemap',
  entry: {
    index: './index.jsx',
  },
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: './build',
    filename: 'index.js',
    sourceMapFilename: 'index.map',
    library: 'Spinner',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)/,
      loader: 'babel',
    }],
  },
  plugins: [],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  externals: {
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
  },
};

module.exports = config;
