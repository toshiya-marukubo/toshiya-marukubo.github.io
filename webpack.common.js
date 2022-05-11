const path = require('path');
const fs = require('fs');
const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const globule = require('globule');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/********************
  functions
********************/
const getFiles = () => {
  const objs = {};
  const files = globule.find(['./src/scripts/*.js', './src/styles/study-of-webgl-works.styl']);
  
  for (let i = 0; i < files.length; i++) {
    const dir = files[i];
    const splited = dir.split('/');
    const last = splited[splited.length - 1];
    const replaced = last.substring(0, last.indexOf('.'));
    
    objs[replaced] = dir;
  }

  return objs;
};

// Amazing code!
// Reference https://qiita.com/turmericN/items/28e8bc8fca07285ddffc
// This code gets html files and directory.
// Thank you so much.
const searchFiles = (dirPath) => {
  const allDirents = fs.readdirSync(dirPath, { withFileTypes: true });

  const files = [];
  for (const dirent of allDirents) {
    if (dirent.isDirectory()) {
      const fp = path.join(dirPath, dirent.name);
      
      files.push(searchFiles(fp));
    } else if (dirent.isFile() && ['.pug'].includes(path.extname(dirent.name))) {
      files.push(path.join(dirPath, dirent.name));
      /*
      files.push({
        dir: path.join(dirPath, dirent.name),
        name: dirent.name,
      });
      */
    }
  }

  return files.flat();
};

/********************
  settings
********************/
const entries = getFiles();

const output = {
  path: path.resolve(__dirname, 'dist'),
  filename: 'js/[name].bundle.js',
  clean: true,
};

const pug = {
  test: /\.pug$/,
  use: [
    {
      loader: 'pug-loader',
      options: {
        pretty: true,
      }
    }
  ]
};

const js = {
  test: /\.js$/,
  include: path.resolve(__dirname, 'src/scripts'),
  use: 'babel-loader',
};

const style = {
  test: /\.styl$/,
  include: path.resolve(__dirname, 'src/styles'),
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    'postcss-loader',
    'stylus-loader', 
  ],
};

const json = {
  test: /\.json$/,
  use: "json-loader",
  type: "javascript/auto",
};

const image = {
  test: /\.(jpe?g|gif|png|svg)$/,
  type: "asset/resource",
  parser: {
    dataUrlCondition: {
      maxSize: 4 * 1024,
    },
  },
  generator: {
    filename: './assets/images/study-of-webgl/[name][ext]',
  },
};

const settings = {
  entry: entries, 
  output: output,

  module: {
    rules: [
      pug,
      js,
      style,
      json,
      image
    ],
  },
  
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/[name].bundle.css',
    }),
    new CopyPlugin({
      patterns: [
        {from: "./src/assets", to: "assets"},
      ],
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new JsonMinimizerPlugin(),
    ],
  },
};

/********************
  from pug to html
********************/
// get html files
const htmls = searchFiles('./src');

// push HtmlWebpackPlugin to settinge plugins
for (let i = 0; i < htmls.length; i++) {
  const html = htmls[i];

  // continue if included module directory
  if (html.match(/modules/)) {
    continue;
  }

  const dir = html;

  let dirArr = dir.split('/');
  dirArr.shift();
  dirArr.shift();
  dirArr = dirArr.join('/').replace('pug', 'html');
  
  settings.plugins.push(
    new HtmlWebpackPlugin({
      filename: `${path.resolve(__dirname, '')}/${dirArr}`,
      inject: false,
      template: dir,
      minify: false,
    })
  );
}

module.exports = settings;
