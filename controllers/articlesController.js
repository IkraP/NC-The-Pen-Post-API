const {
  selectArticleById,
  changeVotes,
  postComments,
  selectCommentByArticleId
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
    .then(article => response.status(200).send({ article }))
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
  selectCommentByArticleId();
};

module.exports = {
  sendArticleById,
  updateVotes,
  sendComments,
  sendCommentByArticleId
};

// an array of comments for the given`article_id` of which each comment should have the following properties:
// - `comment_id`
//   - `votes`
//   - `created_at`
//   - `author` which is the`username` from the users table
//     - `body`
