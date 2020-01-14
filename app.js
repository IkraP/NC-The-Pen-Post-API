const express = require("express");
const app = express();
const apiRouter = require("./routers /apiRouter");
const { send404Error } = require("./error_functions/errors");

app.use("/api", apiRouter);

app.all("/*", send404Error);

app.use((err, request, response, next) => {
  console.log(err, "error handling");
  response.status(err.status).send({ msg: err.msg });
});

module.exports = app;
