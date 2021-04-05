const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 自动清理构建目录
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const webpack = require('webpack');

const glob = require('glob')

const setMPA = () => {
  const entry = {

  }

  const htmlWebpackPlugins = []

  const entryFiles = glob.sync(path.join(__dirname, './src/*/index-server.js'))

  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index]

      // /src/index/index.js
      const match = entryFile.match(/src\/(.*)\/index-server\.js/)
      const pageName = match && match[1]
      console.log("pageName:", pageName)

      if (pageName) {
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
      }
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
    publicPath: './',
    path: path.join(__dirname, 'dist'),
    filename: '[name]-server.js',
    libraryTarget: 'umd'
  },
  mode: 'production',
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
