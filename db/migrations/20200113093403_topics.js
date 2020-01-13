exports.up = function(knex) {
  return knex.schema.createTable("topics", topicsTable => {});
};

exports.down = function(knex) {};
