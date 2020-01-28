const {
  patchCommentById,
  deleteCommentById
} = require("../models/commentsModel");

const updateCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  const { inc_votes } = request.query;
  patchCommentById(comment_id, inc_votes)
    .then(comment => response.status(201).send({ comment }))
    .catch(err => next(err));
};

const removeCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  deleteCommentById()
    .then(() => {
      response.status(204);
    })
    .catch(err => console.log(err));
};

module.exports = { updateCommentById, removeCommentById };
