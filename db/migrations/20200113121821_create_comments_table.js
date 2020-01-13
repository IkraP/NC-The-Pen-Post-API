exports.up = function(knex) {
  console.log("creating a comments table ");
  return knex.schema.createTable("Comments", commentTable => {
    commentTable.increments("comment_id").primary();
    commentTable.string("author").references("Users.username");
    commentTable.integer("article_id").references("Articles.article_id");
    commentTable.integer("votes").defaultTo(0);
    commentTable.timestamp("created_at").defaultTo(knex.fn.now());
    commentTable.text("body").notNullable();
  });
};

exports.down = function(knex) {
  console.log("dropping the comments table");
  return knex.schema.dropTable("Comments");
};
