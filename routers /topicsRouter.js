const topicsRouter = require("express").Router();
const { sendTopics } = require("../controllers/topicsController");
// const { send404Error } = require("../error_functions/errors");

topicsRouter.route("/").get(sendTopics);
// .all(send404Error);

module.exports = topicsRouter;

// exports.send405Error = (req, res, next) => {
//   res.status(405).send({ msg: "method not allowed" });
// };
