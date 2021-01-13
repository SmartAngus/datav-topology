const path = require("path");

module.exports = {
  watch: true,
  mode: "production", // development || production
  entry: "./src/index.tsx",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: "biciDatavTopology",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                modifyVars: {
                  "@ant-prefix": "antdv4",
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.m?jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
  externals: ["react", "react-dom", "moment", "lodash", "bici-transformers", "@ant-design/icons"],
};
