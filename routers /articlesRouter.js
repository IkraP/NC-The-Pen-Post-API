const articlesRouter = require("express").Router();
const {
  sendArticleById,
  updateVotes,
  sendComments,
  sendCommentByArticleId
} = require("../controllers/articlesController");
const { send405Error } = require("../error_functions/errors");

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(updateVotes)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(sendComments)
  .get(sendCommentByArticleId)
  .all(send405Error);

module.exports = articlesRouter;
