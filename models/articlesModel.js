const connection = require("../db/connection");

const selectArticleById = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", article_id)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .countDistinct({ comment_count: "comments.article_id" })
    .then(articlesCount => {
      const formattedCount = articlesCount.map(
        ({ comment_count, ...restOfArticle }) => {
          return { ...restOfArticle, comment_count: +comment_count };
        }
      );
      return formattedCount;
    })
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article doesn't exist"
        });
      } else return article;
    });
};

const changeVotes = (article_id, body) => {
  if (body["inc_votes"] === undefined) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: Missing required field"
    });
  } else {
    return connection("articles")
      .where("article_id", article_id)
      .increment("votes", body.inc_votes || 0)
      .returning("*")
      .then(articles => {
        return articles[0];
      });
  }
};

const postComments = newComment => {
  if (!newComment.author || !newComment.body || !newComment.article_id) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: No comment given"
    });
  }
  return connection("comments")
    .insert(newComment)
    .returning("*")
    .then(([comment]) => {
      return comment;
    });
};

const selectCommentByArticleId = () => {};
module.exports = {
  selectArticleById,
  changeVotes,
  postComments,
  selectCommentByArticleId
};
