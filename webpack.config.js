const path = require('path');

// for not jsx users
module.exports = {
  mode: "production",
  entry: {
    main: './demo.tsx'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  externals: ["fs"],
  module: {
    rules: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: 'ts-loader',
      options: {
        transpileOnly: true
      }
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }]
  },
};