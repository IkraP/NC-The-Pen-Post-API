const articlesRouter = require("express").Router();
const {
  sendArticleById,
  updateVotes,
  sendComments
} = require("../controllers/articlesController");
const { send405Error } = require("../error_functions/errors");

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(updateVotes);

articlesRouter.route("/:article_id/comments").post(sendComments);

module.exports = articlesRouter;
