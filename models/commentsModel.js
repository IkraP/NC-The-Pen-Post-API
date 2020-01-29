const connection = require("../db/connection");

exports.patchCommentbyId = (comment_id, inc_votes) => {
  // newVote - how much the votes will need updating
  return connection
    .select("*")
    .from("comments")
    .where("comment_id", comment_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(comment => {
      console.log(comment);
    });

  // promise.reject if comment not found
  //return an object
};

exports.deleteCommentById = comment_id => {
  return connection("comments")
    .where("comment_id", comment_id)
    .del()
    .then // something here to specifiy if no comment that deleted as doesn't exist then something maybe
    ();
};
