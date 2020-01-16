exports.up = function(knex) {
  // creating a topics table
  return knex.schema.createTable("topics", topicTable => {
    topicTable
      .string("slug")
      .primary()
      .unique();
    topicTable.string("description").notNullable();
  });
};

exports.down = function(knex) {
  // dropping the topics table
  return knex.schema.dropTable("topics");
};
