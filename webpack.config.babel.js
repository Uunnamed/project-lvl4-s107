import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default () => ({
  entry: {
    app: ['./client'],
    vendor: ['babel-polyfill', 'jquery', 'jquery-ujs', 'tether'],
  },
  output: {
    path: path.join(__dirname, 'public', 'assets'),
    filename: 'application.js',
    publicPath: '/assets/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('precss'),
                  require('autoprefixer'),
                ];
              },
            },
          }],
        }),
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000',
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: 'file-loader',
      },

      // Bootstrap 4
      {
        test: /bootstrap\/dist\/js\/umd\//,
        use: 'imports-loader?jQuery=jquery',
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({ filename: 'boundle.css', allChunks: true }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Tether: "tether",
      'window.Tether': 'tether',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      // This name 'vendor' ties into the entry definition
      name: 'vendor',
      // We don't want the default vendor.js name
      filename: 'vendor.js',
      // Passing Infinity just creates the commons chunk, but moves no modules into it.
      // In other words, we only put what's in the vendor entry definition in vendor-bundle.js
      minChunks: Infinity,
    }),
  ],
});
