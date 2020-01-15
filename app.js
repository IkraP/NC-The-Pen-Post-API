const express = require("express");
const app = express();
const apiRouter = require("./routers /apiRouter");
const { send404Error } = require("./error_functions/errors");

app.use("/api", apiRouter);

app.all("/*", send404Error);

app.use((err, request, response, next) => {
  console.log(err, "error handling");
  if (err.status) response.status(err.status).send({ msg: err.msg });
  else next(err);
});

app.use((err, request, response, next) => {
  const psqlCodes = { "22P02": "Bad request" };
  if (psqlCodes[err.code])
    response.status(400).send({ msg: psqlCodes[err.code] });
  next(err);
});

module.exports = app;
