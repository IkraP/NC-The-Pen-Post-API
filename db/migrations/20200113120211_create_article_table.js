exports.up = function(knex) {
  //creating a article table
  console.log("creating an articles table");
  return knex.schema.createTable("Articles", articleTable => {
    articleTable.increments("article_id");
  });
};

exports.down = function(knex) {
  console.log("Dropping articles table");
  return knex.schema.dropTable("Articles");
};
