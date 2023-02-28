const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 该插件作用为每次打包自动清除之前的dist
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 该插件作用为每次打包自动清除之前的dist
const CopyWebpackPlugin = require("copy-webpack-plugin"); // 复制资源到打包的文件夹
const { VueLoaderPlugin } = require("vue-loader"); // vue-loader15以上需要同时当作插件来用

module.exports = {
  target: "web", // 解决webpack不实时刷新问题，或者删除package.json中的browserslist
  mode: "development",  // mode用来指定结构模式，可选值有development 和 production
  optimization: {
    nodeEnv: false
  },
  entry: "./src/main.js",
  devtool: "eval-source-map", // 开发环境设置eval-source-map精准定位报错行数，生产环境设置nosources-source-map防止源码泄漏提高网站安全性
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js",
    publicPath: "./"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.vue$/,  // 处理vue文件
        loader: "vue-loader"
      },
      {
        test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
        use: {
          loader: "file-loader",
          options: {
            name: "imgs/[name].[hash:8].[ext]"
          }
        }
      },
      {
        //处理图片资源
        test: /\.(jpg|png|gif|jpeg|svg)$/,
        //------使用webpack5内置的type
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024  //data转成url的条件，也就是转成bas64的条件,maxSize相当于limit
          }
        },
        generator: {
          //geneator中是个对象，配置下filename，和output中设置assetModuleFilename一样，将资源打包至imgs文件夹
          filename: "imgs/[name].[hash:6][ext]"  //[name]指原来的名字，[hash:6]取哈希的前六位，[ext]指原来的扩展名
        }
      },
      // js兼容性处理
      {
        test: /\.m?js$/,
        exclude: /node_modules/, // Exclude:排除node_modules中的文件，只转换src中的文件 
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      //告诉webpack， @ 符号表示 src目录
      "@": path.join(__dirname, "./src")
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: "webpack打包实例",
      template: path.resolve(__dirname, "./public/index.html"), // 指定源文件路径
      filename: "./index.html", // 指定生成文件的存放路径
      url: path.join(__dirname, "./dist/public/")
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: "public",
    //       to: "./public", // 放到output文件夹下，也就是当前工作文件夹dist内
    //       globOptions: {
    //         // ignore: [ // 忽略某些文件
    //         //   "**/index.html"
    //         // ]
    //       }
    //     }
    //   ]
    // }),
    new webpack.DefinePlugin({ // 「生产/开发」构建中使用不同的服务 URL
      "developUrl": JSON.stringify("http://127.0.0.1:8080"),
      "productUrl": JSON.stringify("http://127.0.0.1:8080"),
      "process.env": {
        NODE_ENV: process.env.NODE_ENV // 将属性转化为全局变量，让代码中可以正常访问
      }
    }),
    // ["@babel/plugin-proposal-decorators", { legacy: true }]
  ],
  devServer: {
    publicPath: "/",
    // contentBase: "./",
    inline: true, // 自动刷新
    historyApiFallback: true, // 当我们搭建spa应用时非常有用，它使用的是HTML5 History Api，任意的跳转或404响应可以指向 index.html页面；
    hot: true, // 模块热更新
    compress: true, // 进行gzip压缩
    port: "8888",
    writeToDisk: true, // 每次运行不清空dist
    open: true
  }
}
