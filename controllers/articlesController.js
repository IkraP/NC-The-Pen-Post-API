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
  const { article_id } = request.params;
  selectCommentByArticleId(article_id)
    .then(comments => response.status(200).send({ comments }))
    .catch(err => console.log(err));
};

module.exports = {
  sendArticleById,
  updateVotes,
  sendComments,
  sendCommentByArticleId
};

// GET / will respond with a 404 when an article doesn't exist", () => {
// // return request(app)
// //   .get("/api/articles/999999")
//   .expect(404)
//   .then(({ body: { msg } }) => {
//     expect(msg).to.equal("Article doesn't exist");
//   });
//       });
// it("GET / will respond with a 400 Bad request when no article_id is specified", () => {
//   return request(app)
//     .get("/api/articles/notanid")
//     .expect(400)
//     .then(({ body: { msg } }) => {
//       expect(msg).to.equal("Bad request");
