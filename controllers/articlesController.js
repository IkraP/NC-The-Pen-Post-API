const { selectArticleById } = require("../models/articlesModel");

const sendArticleById = (request, response, next) => {
  console.log(request.params);
  selectArticleById();
  response.status(200).send();
};

module.exports = { sendArticleById };
