const apiRouter = require("express").Router();

const topicsRouter = require("./topicsRouter");

apiRouter.use("/", topicsRouter);

module.exports = apiRouter;
