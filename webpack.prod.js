const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 自动清理构建目录
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const webpack = require('webpack');

const glob = require('glob')

const setMPA = () => {
  const entry = {

  }

  const htmlWebpackPlugins = []

  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))

  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index]

      // /src/index/index.js
      const match = entryFile.match(/src\/(.*)\/index\.js/)
      const pageName = match && match[1]

      entry[pageName] = entryFile
      htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          template: path.join(__dirname, `src/${pageName}/index.html`),
          filename: `${pageName}.html`,
          chunks: [pageName],
          inject: true,
          minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: false
          }
        }) 
      )
    })

  return {
    entry,
    htmlWebpackPlugins
  }
}

const { entry, htmlWebpackPlugins } = setMPA()

module.exports = {
  // entry: {
  //   index: './src/index.js',
  //   search: './src/search.js'
  // },
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  mode: 'production',
  stats: 'errors-only',
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: [
          'babel-loader',
          'eslint-loader'
        ]
      },
      {
        test: /.css$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            {
              loader: 'px2rem-loader',
              options: {
                remUi: 75,
                remPrecision: 8
              }
            }
        ]
      },
      {
        test: /.less$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader',
            // css 增加前缀
            'postcss-loader',
            {
              loader: 'px2rem-loader',
              options: {
                remUi: 75,
                remPrecision: 8
              }
            }
        ]
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name]_[hash:8][ext]'
                }
            }
        ]
      }
    ]
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new webpack.ProgressPlugin(),
    // 自动清理构建目录
    new CleanWebpackPlugin(),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://11.url.cn/now/lib/17.0.1/react.min.js',
          global: 'React',
        },
        {
          module: 'react-don',
          entry: 'https://11.url.cn/now/lib/17.0.1/react-dom.min.js',
          global: 'ReactDOM',
        },
      ],
      files: ['search.html']
    }),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    }),
    function() {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1)
          {
              console.log('build error');
              process.exit(1);
          }
      })
    }
  ].concat(htmlWebpackPlugins),
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  }
}

// optimization: {
//   splitChunks: {
//     // async：异步引入的库进行分离（默认）， initial： 同步引入的库进行分离， all：所有引入的库进行分离（推荐）
//     chunks: 'async',
//     minSize: 30000, // 抽离的公共包最小的大小，单位字节
//     maxSize: 0, // 最大的大小
//     minChunks: 1, // 资源使用的次数(在多个页面使用到)， 大于1， 最小使用次数
//     maxAsyncRequests: 5, // 并发请求的数量
//     maxInitialRequests: 3, // 入口文件做代码分割最多能分成3个js文件
//     automaticNameDelimiter: '~', // 文件生成时的连接符
//     automaticNameMaxLength: 30, // 自动自动命名最大长度
//     name: true, //让cacheGroups里设置的名字有效
//     cacheGroups: { //当打包同步代码时,上面的参数生效
//       vendors: {
//         test: /[\\/]node_modules[\\/]/, //检测引入的库是否在node_modlues目录下的
//         priority: -10, //值越大,优先级越高.模块先打包到优先级高的组里
//         filename: 'vendors.js'//把所有的库都打包到一个叫vendors.js的文件里
//       },
//       default: {
//         minChunks: 2, // 上面有
//         priority: -20, // 上面有
//         reuseExistingChunk: true //如果一个模块已经被打包过了,那么再打包时就忽略这个上模块
//       }
//     }
//   }
// }