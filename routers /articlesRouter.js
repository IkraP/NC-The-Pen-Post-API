const articlesRouter = require("express").Router();
const { sendArticleById } = require("../controllers/articlesController");
const { send404Error } = require("../error_functions/errors");

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .all(send404Error);

module.exports = articlesRouter;
