exports.up = function(knex) {
  //creating a article table

  return knex.schema.createTable("articles", articleTable => {
    articleTable.increments("article_id").primary();
    articleTable.string("title");
    articleTable.text("body").notNullable();
    articleTable.integer("votes").defaultTo(0);
    articleTable
      .string("topic")
      .unsigned()
      .references("topics.slug")
      .onDelete("CASCADE");
    articleTable
      .string("author")
      .references("users.username")
      .notNullable()
      .onDelete("SET NULL");
    articleTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("articles");
};
