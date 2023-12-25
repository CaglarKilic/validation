const path = require("path");
const HtmlWwebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
  },
  devServer: {
    watchFiles: ["./template.html"],
  },
  devtool: "eval-source-map",
  plugins: [
    new HtmlWwebpackPlugin({
      title: "Validation",
      template: "template.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};
