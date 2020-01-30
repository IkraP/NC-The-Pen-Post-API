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
      } else return article[0];
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
    sort_by !== "comment_id" &&
    sort_by !== "votes" &&
    sort_by !== "created_at" &&
    sort_by !== "author" &&
    sort_by !== "body"
  ) {
    sort_by = "created_at";
  }
  // make it not a make a request unless empty array
  return selectArticleById(article_id).then(articleExist => {
    console.log(articleExist);
    if (articleExist) {
      return connection("comments")
        .select("comment_id", "votes", "created_at", "author", "body")
        .where("article_id", article_id)
        .returning("*")
        .orderBy(sort_by, order);
    }
  });
};

const selectAllArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  if (order !== "asc" && order !== "desc") order = "desc";
  if (
    sort_by !== "article_id" &&
    sort_by !== "title" &&
    sort_by !== "body" &&
    sort_by !== "votes" &&
    sort_by !== "topic" &&
    sort_by !== "author" &&
    sort_by !== "created_at" &&
    sort_by !== "comment_count"
  ) {
    sort_by = "created_at";
  }
  console.log(sort_by, order);
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .orderBy(sort_by, order)
    .groupBy("articles.article_id")
    .count({ comment_count: "comment_id" })
    .modify(query => {
      if (author) query.where("articles.author", author);
      if (topic) query.where("articles.topic", topic);
    })
    .then(articles => {
      const formattedResult = articles.map(
        ({ comment_count, ...restOfArticle }) => {
          delete restOfArticle.body;
          return { ...restOfArticle, comment_count: +comment_count };
        }
      );

      const checkUserExistPromise = checkUserExistance(author);
      const checkTopicExistPromise = checkTopicExistance(topic);

      return Promise.all([
        checkUserExistPromise,
        checkTopicExistPromise,
        formattedResult
      ]);
    })
    .then(
      ([checkUserExistPromise, checkTopicExistPromise, formattedResult]) => {
        if (checkUserExistPromise && checkTopicExistPromise) {
          return formattedResult;
        } else {
          return Promise.reject({
            status: 404,
            msg: "Invalid Input - resource doesn't exist"
          });
        }
      }
    );
};

const checkUserExistance = author => {
  if (!author) return true;
  return connection("users")
    .where("username", author)
    .then(userExists => {
      if (userExists.length === 0) return false;
      return true;
    });
};

const checkTopicExistance = topic => {
  if (!topic) return true;
  return connection("topics")
    .where("slug", topic)
    .then(topicExists => {
      if (topicExists.length === 0) return false;
      return true;
    });
};

module.exports = {
  checkTopicExistance,
  checkUserExistance,
  selectAllArticles,
  selectArticleById,
  selectCommentByArticleId,
  changeVotes,
  postComments
};
