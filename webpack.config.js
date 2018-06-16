const nodeExternals = require('webpack-node-externals')
const path = require('path')

module.exports = {
  target: 'node',
  externals: [nodeExternals()],
  entry: [path.resolve(__dirname), '.', './index.js'],
  output: {
    path: path.resolve(__dirname, '.', 'dist'),
    publicPath: './dist/public',
    filename: 'server.js', 
    library: 'app',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.marko/,
        loader: 'marko-loader'
      }
    ]
  }
}
