const connection = require("../db/connection");

const selectArticleById = article_id => {
  return connection("articles")
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "article_id" })
    .leftJoin("users", "articles.article_id", "users.username")
    .groupBy("articles.article_id")
    .then(response => console.log(response));
};

module.exports = { selectArticleById };
