const connection = require("../db/connection");

const patchCommentbyId = (comment_id, inc_votes) => {
  return connection
    .select("*")
    .from("comments")
    .where("comment_id", comment_id)
    .increment("votes", inc_votes || 0)
    .returning("*")
    .then(comment => {
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment does not exist"
        });
      }
      return comment[0];
    });
};

const deleteCommentById = comment_id => {
  return connection("comments")
    .where("comment_id", comment_id)
    .del()
    .then(comment => {
      if (comment === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment does not exist"
        });
      }
      return comment;
    });
};

module.exports = {
  deleteCommentById,
  patchCommentbyId
};
