const { selectArticleById, changeVotes } = require("../models/articlesModel");

const sendArticleById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleById(article_id)
    .then(article => response.status(200).send({ article }))
    .catch(err => next(err));
};

const updateVotes = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  console.log(inc_votes);
  changeVotes(inc_votes, article_id)
    .then(article => response.status(200).send({ article }))
    .catch(err => console.log(err));
};

module.exports = { sendArticleById, updateVotes };
