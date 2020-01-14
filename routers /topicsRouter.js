const topicsRouter = require("express").Router();
const { sendTopics } = require("../controllers/topicsController");
const { send405Error } = require("../error_functions/errors");

topicsRouter
  .route("/")
  .get(sendTopics)
  .all(send405Error);

module.exports = topicsRouter;
