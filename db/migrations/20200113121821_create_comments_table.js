exports.up = function(knex) {
  console.log("creating a comments table ");
  return knex.schema.createTable("comments", commentTable => {
    commentTable.increments("comment_id").primary();
    commentTable
      .string("author")
      .references("users.username")
      .onDelete("SET NULL");
    commentTable
      .integer("article_id")
      .references("articles.article_id")
      .onDelete("CASCADE");
    commentTable.integer("votes").defaultTo(0);
    commentTable.timestamp("created_at").defaultTo(knex.fn.now());
    commentTable.text("body");
  });
};

exports.down = function(knex) {
  console.log("dropping the comments table");
  return knex.schema.dropTable("comments");
};
