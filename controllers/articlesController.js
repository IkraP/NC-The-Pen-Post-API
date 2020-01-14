const { selectArticleById } = require("../models/articlesModel");

const sendArticleById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleById(article_id);
  response.status(200).send();
};

module.exports = { sendArticleById };
