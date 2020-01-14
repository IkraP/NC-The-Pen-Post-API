const express = require("express");
const app = express();
const apiRouter = require("./routers /apiRouter");

// route handling
app.use("/api", apiRouter);
// error handling ;

module.exports = app;
