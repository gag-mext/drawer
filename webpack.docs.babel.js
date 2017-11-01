'use strict';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const pkg = require('./package.json');
const pxtorem = require('postcss-pxtorem');

const prod = process.env.NODE_ENV === 'production';

const hotEntry = [
  'webpack/hot/dev-server',
  'webpack-hot-middleware/client?reload=true',
];
//入口文件
const entry = './demo/basic.jsx';
//const ksEntry = './src/pages/kitchen-sink/entry.js';

let minify = prod ? {
  // 压缩HTML文件
  removeComments: true,
  // 移除HTML中的注释
  collapseWhitespace: true,
    // 删除空白符与换行符
  minifyCSS: true,
} : false;
//入口模板加载
let plugins = [
  new HtmlWebpackPlugin({
    template: 'index.html',
    prod,
    chunks: ['entry'],
    // 指定引入的chunk，根据entry的key配置，不配置就会引入所有页面的资源
    minify,
  }),
  //new HtmlWebpackPlugin({
  //  filename: './src/pages/kitchen-sink/index.html',
  //  template: './src/pages/kitchen-sink/index.html',
  //  chunks: ['ks'],
  //  minify,
  //}),
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(pkg.version),
    SERVER_RENDING: false,
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    },
  }),
];


// function getTingleModuleAlias() {
//   const alias = {};
//
//   // 判断是否存在tingle目录
//   if (!fs.existsSync('./tingle')) return alias;
//
//   const modules = fs.readdirSync('./tingle');
//   modules.forEach(function (name) {
//     alias[name] = [process.cwd(), 'tingle', name, 'src'].join('/');
//   });
//   return alias;
// }
plugins = prod ? plugins.concat([
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),
  new ExtractTextPlugin('[name].[hash:5].min.css'),
  new webpack.BannerPlugin(`build: ${new Date().toString()}`),
]) : plugins.concat([
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  // 启用热替换,仅开发模式需要
  new webpack.NoErrorsPlugin(),
]);

module.exports = {
  entry: {
    entry: prod ? entry : [].concat(hotEntry).concat(entry),
    //ks: prod ? ksEntry : [].concat(hotEntry).concat(ksEntry),
  },
  output: {
    filename: `[name].[hash:5]${prod ? '.min' : ''}.js`,
    sourceMapFilename: "[name].[hash:5].js.map",
    path: `${__dirname}/dist`,
    publicPath: '/',// 服务器静态资源路径配置
  },
  devtool: prod ? null : '#source-map',
  module: {
    loaders: [{
        test: /\.jsx?$/,
         exclude: function (path) {
                     const isNpmModule = !!path.match(/node_modules/);
                     const isGagModule = !!path.match(/node_modules[\/\\]\@gag/);
                     return isNpmModule && !isGagModule;
                 },
        loaders: [
          //'transform/cacheable?brfs',
          'babel',
        ]
      }, {
        test: /\.md$/,
        loader: 'html!markdown'
      }, {
        test: /\.(less|css)$/,
        loader: prod ? ExtractTextPlugin.extract('style',
          'css?minimize!postcss!less') : 'style!css?sourceMap!postcss!less?sourceMap',
      },
      /*{
        test: /\.(ttf|svg|woff)$/,
        loader: 'file?name=[path][name].[ext]&context=src'
      },*/
      // @see https://shellmonger.com/2016/01/22/working-with-fonts-with-webpack/
      {
        test: /\.svg$/,
        loader: 'svg-sprite?' + JSON.stringify({
          name: 'icon-[1]',
          prefixize: true,
          regExp: './my-folder/(.*)\\.svg'
        })
      },
      //{
      //   test: /\.svg$/,
      //   loader: 'url?mimetype=image/svg+xml&name=[name].[ext]'
      // },
      {
        test: /\.woff$/,
        loader: 'url?mimetype=application/font-woff&name=[name].[ext]'
      }, {
        test: /\.woff2$/,
        loader: 'url?mimetype=application/font-woff2&name=[name].[ext]'
      }, {
        test: /\.[ot]tf$/,
        loader: 'url?mimetype=application/octet-stream&name=[name].[ext]'
      },
    ]
  },
  resolve: {
    // 路径别名, 懒癌福音
    alias: {
      app: path.resolve(__dirname, 'src/js'),
      // 以前你可能这样引用 import { Nav } from '../../components'
      // 现在你可以这样引用 import { Nav } from 'app/components'

      style: path.resolve(__dirname, 'src/styles')
        // 以前你可能这样引用 import "../../../styles/mixins.scss"
        // 现在你可以这样引用 import "style/mixins.scss"

      // 注意：别名只能在.js文件中使用。
    },
    extensions: ['', '.js', '.jsx'] //后缀名自动补全
  },
  plugins: plugins,
  postcss: function () {
    return [
      require('precss'),
      require('rucksack-css'),
      pxtorem({
        rootValue: 100,
        propWhiteList: [],
      }),
      autoprefixer({
        browsers: ['> 1%', 'last 2 versions', 'ie 10']
      })
    ];
  }
};
