const express = require("express");
const app = express();
const apiRouter = require("./routers /apiRouter");
const cors = require("cors");
const {
  send404Error,
  sendCustomError,
  sendPSQLError,
  send500Error
} = require("./error_functions/errors");

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

app.all("/*", send404Error);

app.use(sendCustomError);
app.use(sendPSQLError);
app.use(send500Error);

module.exports = app;
