# Frontrockets-builder

Convinient config for webpack. Familiar with Ruby on Rails applications.

Setup paths and PostCSS plugins for each project.

[How to use with rails](#how-to-use-with-rails).

## Installation

```
npm install frontrockets-builder --save
```

## Usage

Build your assets on the fly:

```
./node_modules/.bin/webpack -w [--config config/assets_builder.js]
```

Or build for production:

```
NODE_ENV=production ./node_modules/.bin/webpack [--config config/assets_builder.js]
```

## Setup

Coming soon...

## How to use with Rails

Follow 3 simple steps:

* Add `frontrockets-builder.js` in the root path.
* Install dependencies.
* Update `.gitignore` to exclude bundles.

`frontrockets-builder.js`:
```js
var options = {
  entry: {
    // Custom:
    application: {
      javascripts: 'app/assets/javascripts/application.entry.js',
      stylesheets: 'app/assets/stylesheets/application.entry.css'
    }
  },

  output: {
    path: './vendor/assets',

    // Custom:
    filenameCss: 'stylesheets/dist/[name].css',
    filenameJs: 'javascripts/dist/[name].js',
    filenameImage: 'images/components/[name]-[sha512:hash:hex:6].[ext]',
    dirForImageRelativeToOutputPath: 'components/' // Hackish
  },

  // Patched:
  postcss: function(webpack) {
    return [
      require('precss'),
      require('autoprefixer')
    ];
  },

  babel_presets: ['es2015']
};

module.exports = require('frontrockets-builder')(options);
```

Install dependencies:
```
npm install autoprefixer babel-preset-es2015 --save
```

Update gitignore by adding builder's bundles:
```
/vendor/assets/images/components
/vendor/assets/javascripts/dist
/vendor/assets/stylesheets/dist
```
