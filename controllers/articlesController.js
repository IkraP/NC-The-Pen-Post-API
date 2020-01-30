const {
  selectArticleById,
  changeVotes,
  postComments,
  selectCommentByArticleId,
  selectAllArticles
} = require("../models/articlesModel");

const sendArticleById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleById(article_id)
    .then(article => response.status(200).send({ article }))
    .catch(err => next(err));
};

const updateVotes = (request, response, next) => {
  const { article_id } = request.params;
  changeVotes(article_id, request.body)
    .then(article => response.status(202).send({ article }))
    .catch(err => next(err));
};

const sendComments = (request, response, next) => {
  const newComment = request.body;
  newComment.author = newComment.username;
  newComment.article_id = request.params.article_id;
  delete newComment.username;

  postComments(newComment)
    .then(comment => {
      response.status(201).send({ comment });
    })
    .catch(err => next(err));
};

const sendCommentByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const { sort_by, order } = request.query;

  selectCommentByArticleId(article_id, sort_by, order)
    .then(comments => response.status(200).send({ comments }))
    .catch(err => next(err));
};

const sendAllArticles = (request, response, next) => {
  const { sort_by, order, author, topic } = request.query;
  selectAllArticles(sort_by, order, author, topic)
    .then(articles => {
      response.status(200).send({ articles, total_count: articles.length });
    })
    .catch(err => next(err));
};
module.exports = {
  sendArticleById,
  updateVotes,
  sendComments,
  sendCommentByArticleId,
  sendAllArticles
};
