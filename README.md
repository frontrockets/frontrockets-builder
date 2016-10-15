# frontrockets-builder

It provides two helpers to setup webpack easily for some CMS (like Ruby on Rails).

[How to setup webpack for Ruby on Rails](#how-to-setup-webpack-for-ruby-on-rails-applications)

## Features

* [Setup entry points for stylesheets and javascripts separately](#setup-entry-points-for-stylesheets-and-javascripts-separately)
* [Setup correct paths for binary files](#setup-correct-paths-for-binary-files)

### Setup entry points for stylesheets and javascripts separately 

```js
// @webpack.config.js

const SetupEntryPoints = require('frontrockets-builder/lib/setup-entry-points');

const entryPoints = {
  application: {
    javascripts: './app/assets/javascripts/application.entry.js',
    stylesheets: './app/assets/stylesheets/application.entry.scss',
  },
  admin: {
    javascripts: './app/assets/javascripts/admin.entry.js',
  },
};

// Should be in `.gitignore` so in example I use `tmp` directory.
const directoryForEntryPoints = './tmp/entry_points';

module.exports = {
  entry: new SetupEntryPoints(entryPoints, directoryForEntryPoints)
// entry: {
//   application: './tmp/entry_points/application.js', // will contain requires for two files which you defined above
//   admin: './tmp/entry_points/admin.js' // will contain require for one file
// }
}
```

### Setup correct paths for binary files

Just change your `url-loader` and `file-loader` to `frontrockets-builder/lib/assets-loader`.

This loader provides another query parameter `publicPrefix` which will be used for outputing an url. Look at the example:

```js
// @webpack.config.js

const filenameImg = 'images/components/[name]-[sha512:hash:hex:6].[ext]';
const dirForImageRelativeToOutputPath = '/assets/';

module.exports = {
  module: {
    loaders: [
      {
        test: /\.(jpe?g|tiff|gif|bmp|png|webp|svg)/,
        loader: 'frontrockets-builder/lib/assets-loader',
        query: {
          limit: 1024,
          name: filenameImg,
          publicPrefix: dirForImageRelativeToOutputPath
        }
      }
    ]
  }
}
```

Without `publicPrefix` you get urls in compiled css like `name` parameter. But with `publicPrefix` you can specify prefix for such names, so it allows us to configure correct urls in compiled css.

## How to setup webpack for Ruby On Rails applications:

1. `npm init`

2. `npm install frontrockets-builder --save`

3. Install dependencies for compiling assets:
  `npm install --save babel-loader babel-preset-es2015 copy-webpack-plugin extract-text-webpack-plugin`

4. Add bundle directories to `.gitignore`:
  ```
  /node_modules
  
  # Ignore built assets files
  /public/bundle
  /vendor/assets/images/components
  /vendor/assets/javascripts/dist
  /vendor/assets/stylesheets/dist
  ```
  `public/bundle` will be used for your assets from `app/assets`
  
5. Create `config/assets_builder.js`
   ```js
  const path = require('path');
  const webpack = require('webpack');
  const ExtractTextPlugin = require('extract-text-webpack-plugin');
  const SetupEntryPoints = require('frontrockets-builder/lib/setup-entry-points');
  const CopyWebpackPlugin = require('copy-webpack-plugin');

  const options = {
    entry: {
      application: {
        javascripts: './app/assets/javascripts/application.entry.js',
        stylesheets: './app/assets/stylesheets/application.entry.scss',
      },
    },
    path: './vendor/assets',
    filenameJs: 'javascripts/dist/[name].js',
    filenameCss: 'stylesheets/dist/[name].css',
    filenameFont: '../../public/bundle/fonts/[name].[ext]',
    dirForFontsRelativeToOutputPath: '/bundle/fonts/',
    filenameImg: '../../public/bundle/images/[name]-[sha512:hash:hex:6].[ext]',
    dirForImageRelativeToOutputPath: '/bundle/images/',
  };

  module.exports = {
    entry: new SetupEntryPoints(options.entry, './tmp/entry_points'),
    output: {
      path: options.path,
      filename: options.filenameJs,
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
    },
    module: {
      loaders: [
        {
          test: /\.(woff2?|ttf|otf|eot|svg)/,
          loader: 'frontrockets-builder/lib/assets-loader',
          query: {
            limit: 1024,
            name: options.filenameFont,
            publicPrefix: options.dirForFontsRelativeToOutputPath,
          },
        },
        {
          test: /\.(jpe?g|tiff|gif|bmp|png|webp|svg)/,
          loader: 'frontrockets-builder/lib/assets-loader',
          query: {
            limit: 1024,
            name: options.filenameImg,
            publicPrefix: options.dirForImageRelativeToOutputPath,
          },
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style-loader', [
            'css-loader'
          ]),
          include: path.resolve(__dirname, '../app/'),
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015'],
          },
          include: path.resolve(__dirname, '../app/'),
          exclude: /node_modules/,
        },
      ],
    },

    plugins: [
      new ExtractTextPlugin(options.filenameCss, {
        allChunks: true,
      }),
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new CopyWebpackPlugin([
        {
          context: './app/concepts',
          from: '**/*.+(jpeg|jpg|tiff|gif|bmp|png|webp|svg)',
          to: 'images/components',
        },
      ]),
    ],
  };
  ```
  Be sure that in this example we store all independent components in `app/concepts`.
