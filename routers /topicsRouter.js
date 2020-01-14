const topicsRouter = require("express").Router();

topicsRouter.route("/").get(() => console.log("HIIIIII "));

module.exports = topicsRouter;
