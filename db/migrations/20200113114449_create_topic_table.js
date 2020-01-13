exports.up = function(knex) {
  // creating a topics table
  console.log("Creating a topics table");
  return knex.schema.createTable("Topics", topicTable => {
    topicTable.increments("slug").primary();
    topicTable.string("description").notNullable();
  });
};

exports.down = function(knex) {
  // dropping the topics table
  console.log("Dropping the topics table");
  return knex.schema.dropTable("Topics");
};
