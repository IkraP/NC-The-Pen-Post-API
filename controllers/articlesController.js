const { selectArticleById } = require("../models/articlesModel");

const sendArticleById = (request, response, next) => {
  console.log(request.params);
  selectArticleById();
};

module.exports = { sendArticleById };
