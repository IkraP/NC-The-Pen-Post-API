const articlesRouter = require("express").Router();
const {
  sendArticleById,
  updateVotes
} = require("../controllers/articlesController");
const { send404Error } = require("../error_functions/errors");

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(updateVotes)
  .all(send404Error);

module.exports = articlesRouter;
