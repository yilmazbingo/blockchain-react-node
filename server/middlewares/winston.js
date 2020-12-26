const winston = require("winston");
const appRoot = require("app-root-path");
// require("winston-mongodb");

let options = {
  file: {
    level: "info",
    filename: `${appRoot}/logs/winston.log`,
    handleExceptions: true,
    handleRejections: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 4,
    colorize: true,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
  //   database: {
  //     db: "mongodb://localhost/bingobookstore",
  //     level: "info",
  //     collection: "errors",
  //     handleExceptions: true,
  //     json: true,
  //     maxsize: 5242880,
  //     maxFiles: 4,
  //     colorize: true
  //   }
};

//If an error is thrown outside express, this middleware function cannot be called
module.exports = function (err, req, res, next) {
  const logger = winston.createLogger({
    trasports: [
      winston.add(new winston.transports.File(options.file)),
      winston.add(new winston.transports.Console(options.console)),
      //   winston.add(new winston.transports.MongoDB(options.database)),
    ],
    exitOnError: false,
  });

  logger.stream = {
    write: function (message, encoding) {
      logger.info(message);
    },
  };
  //   winston.error(res.status(500).send("something failed"), err);
  res.status(500).send("something failed");
  next();
};
