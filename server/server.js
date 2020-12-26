const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const winstonLogger = require("./middlewares/winston");
const noFavicon = require("express-no-favicons");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use("/api/", apiLimiter);
app.use(helmet());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(noFavicon());

app.use(winstonLogger);

app.use(require("./routes"));

const webpackMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpack = require("webpack");
const webpackConfig = require("../webpack.config.js");
const compiler = webpack(webpackConfig);
const history = require("connect-history-api-fallback");

app.use(history());

app.use(
  webpackMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  })
);
app.use(
  webpackHotMiddleware(compiler, {
    path: "/__webpack_hmr",
    heartbeat: 10 * 1000,
  })
);

module.exports = app;
