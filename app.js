const express = require("express");
const app = express();
const apiRouter = require("./routers /apiRouter");
const {
  send404Error,
  sendCustomError,
  sendPSQLError
} = require("./error_functions/errors");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", send404Error);

app.use(sendCustomError);

app.use(sendPSQLError);
module.exports = app;
