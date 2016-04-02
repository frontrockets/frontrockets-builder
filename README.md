# Frontrockets-builder

Configurable builder on webpack. Integrates well with Ruby on Rails applications.

Setup paths and PostCSS plugins for each project.

[How to use with rails](#how-to-use-with-rails).

## Installation

```
npm install frontrockets-builder --save
```

## Usage

Build your assets on the fly:

```
./node_modules/.bin/frontrockets-builder [start]
```

Or build for production:

```
./node_modules/.bin/frontrockets-builder build
```

## Setup

Coming soon...

## How to use with Rails

Follow 3 simple steps:

* Add `frontrockets-builder.yml` in the root path.
* Install dependencies.
* Update `.gitignore` to exclude bundles.

`frontrockets-builder.yml`:
```yml
entry:
  application:
    assets:
      javascripts: [.js]
      stylesheets: [.css]
    components: [.js, .css, .png]

outputPath: ./vendor/assets

outputCssFilename: stylesheets/dist/[name].css
outputJsFilename: javascripts/dist/[name].js
outputImageFilename: images/components/[name]-[sha512:hash:hex:6].[ext]
publicPrefixImage: components/

postcss:
  plugins:
    - autoprefixer
```

Install dependencies:
```
npm install autoprefixer --save
```

Update gitignore by adding builder's bundles:
```
/vendor/assets/images/components
/vendor/assets/javascripts/dist
/vendor/assets/stylesheets/dist
```
