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

const selectCommentByArticleId = (article_id, sort_by, order) => {
  // default values set for order and sort_by queries
  if (order !== "asc" || order !== "desc") order = "desc";
  if (
    (sort_by !== "comment_id" ||
      sort_by !== "votes" ||
      sort_by !== "created_at" ||
      sort_by !== "author",
    sort_by !== "body")
  )
    sort_by = "created_at";
  return selectArticleById(article_id)
    .then(articleExist => {
      if (articleExist.length) {
        return connection("comments")
          .select("comment_id", "votes", "created_at", "author", "body")
          .where("article_id", article_id)
          .returning("*")
          .orderBy(sort_by, order);
      }
    })
    .then(comments => {
      return comments;
    });
};

const selectAllArticles = (sort_by = "created_at", author, topic) => {
  if (order !== "asc" || order !== "desc") order = "desc";
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .orderBy(sort_by, order)
    .groupBy("articles.article_id")
    .count("comment_id as comment_count")
    .modify(query => {
      if (author) query.where("articles_author", author);
      if (topic) query.where({ topic });
    })
    .then(commentCount => {
      const formattedCount = commentCount.map(
        ({ comment_count, ...restOfArticle }) => {
          delete restOfArticle.body;
          return { ...restOfArticle, comment_count: +comment_count };
        }
      );
      return formattedCount;
    });
};

module.exports = {
  selectArticleById,
  changeVotes,
  postComments,
  selectCommentByArticleId,
  selectAllArticles
};
