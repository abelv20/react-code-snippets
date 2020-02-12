/**
 * General shared configuration.  Should be the
 * first config part merged into the final webpack
 * configuration; subsequent parts will extend and/or
 * override configuration specified here.
 */

import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import DotenvPlugin from 'webpack-dotenv-plugin';

import indexHtml from './indexHtml';

function config() {
  const rootPath = process.cwd();
  const DIRS = {
    src: 'src',
    build: 'dist',
  };
  const PATHS = {
    src: path.join(rootPath, DIRS.src),
    build: path.join(rootPath, DIRS.build),
  };

  return merge([
    {
      context: PATHS.src,
      entry: {
        app: ['./index.js'],
        vendor: [
          // Ordering is critical for IE 10 & 11. All polyfills must be loaded before
          // react & react dom or errors will be raised. This is an issue with React >= 15.4,
          // as noted here - https://github.com/facebook/react/issues/8379
          'bugsnag-js',
          'babel-polyfill',
          'isomorphic-fetch',
          'intl',
          'immutable',
          'lodash',
          'moment',
          'moment-timezone',
          'react',
          'react-dom',
          'react-intl',
          'react-redux',
          'redux-saga',
          'react-router',
          'styled-components',
          'react-select-plus',
          'kefir',
          'react-google-maps',
        ],
      },
      output: {
        path: PATHS.build,
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        publicPath: '/',
      },
      module: {
        rules: [
          {
            test: /\.html$/,
            exclude: /node_modules/,
            use: {
              loader: 'file-loader',
              query: {
                name: '[name].[ext]',
              },
            },
          },
          {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
              'style-loader',
              'css-loader',
            ],
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
              },
            ],
          },
          // TODO: add image loaders, font loaders etc as needed
        ],
      },
      plugins: [
        new DotenvPlugin({
          sample: './.env.default',
          path: './.env',
        }),

        new webpack.NamedModulesPlugin(),
      ],
      resolve: {
        extensions: [
          '.webpack-loader.js',
          '.web-loader.js',
          '.loader.js',
          '.js',
          '.react.js',
        ],
        modules: [
          'node_modules',
          DIRS.src,
        ],
      },
      target: 'web',
    },
    indexHtml(),
  ]);
}

export default config;
