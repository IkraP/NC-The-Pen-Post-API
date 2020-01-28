const commentsRouter = require("express").Router();
const {
  updateCommentById,
  removeCommentById
} = require("../controllers/commentsController");

const { send405Error } = require("../error_functions/errors");

// commentsRouter
//   .route("/:comment_id")
//   .patch(updateCommentById)
//   .delete(removeCommentById)
//   .all(send405Error);

module.exports = commentsRouter;
