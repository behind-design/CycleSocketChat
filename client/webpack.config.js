module.exports = {
  entry: './src/main.js',
  output: {
    filename: './dist/bundle.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test   : /.js$/,        
        //test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  }
};