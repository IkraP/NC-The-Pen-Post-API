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
  const columns = ["comment_id", "votes", "created_at", "author", "body"];
  if (!sort_by.includes(columns)) sort_by = "created_at";
  console.log(article_id, sort_by, order);
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

const selectAllArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  if (order !== "asc" && order !== "desc") order = "desc";
  const columns = [
    "article_id",
    "title",
    "body",
    "votes",
    "topic",
    "author",
    "created_at",
    "comment_count"
  ];
  if (!sort_by.includes(columns)) sort_by = " created_at";

  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .orderBy(sort_by, order)
    .groupBy("articles.article_id")
    .count("comment_id as comment_count")
    .modify(query => {
      if (author) query.where("articles.author", author);
      if (topic) query.where("articles_topic", topic);
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
        if (checkUserExistPromise && checkTopicExistPromise)
          return formattedResult;
        else {
          Promise.reject({
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
      userExists.length === 0 ? "false" : "true";
    });
};

const checkTopicExistance = topic => {
  if (!topic) return true;
  return connection("topics")
    .where("slug", topic)
    .then(topicExists => {
      topicExists.length === 0 ? "false" : "true";
    });
};

module.exports = {
  selectArticleById,
  changeVotes,
  postComments,
  selectCommentByArticleId,
  selectAllArticles,
  checkUserExistance,
  checkTopicExistance
};
