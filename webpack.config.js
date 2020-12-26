const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  entry: [
    "regenerator-runtime/runtime",
    "webpack-hot-middleware/client?reload=true?path=http://localhost:4500/__webpack_hmr",
    "react-hot-loader/patch",
    "./client/index.js",
  ],
  name: "client",
  output: {
    path: path.resolve(__dirname, "public"),
    publicPath: "/",
    filename: "main-bundle.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        use: "babel-loader",
        test: /\.js$/,
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: [
          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: {
          //     esModule: true,
          //   },
          // },
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(jpg|jpeg|png|gif|ico)$/,
        use: [
          {
            loader: "file-loader",
            options: { name: "images/[name].[ext]" },
          },
        ],
      },
    ],
  },
  devServer: {
    devtool: "cheap-module-eval-source-map",
    hot: true,

    overlay: true,
    // contentBase: path.resolve(__dirname, "client"),

    // we do not this becasue server is handling history too
    // historyApiFallback: true,
  },
  plugins: [
    new OptimizeCssAssetsPlugin(),

    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
    new FaviconsWebpackPlugin("./public/favicon.ico"),
    new webpack.EvalSourceMapDevToolPlugin(),

    // new MiniCssExtractPlugin({ filename: "main.css" }),
    // new CleanWebpackPlugin(),
    //those 2 are for the webpack-hot-middleware
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env.GENERATE_PEER_PORT": JSON.stringify(
        process.env.GENERATE_PEER_PORT
      ),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};

// "webpack-hot-middleware/client",
