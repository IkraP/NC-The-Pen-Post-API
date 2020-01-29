exports.up = function(knex) {
  // creating a user table

  return knex.schema.createTable("users", userTable => {
    userTable
      .string("username")
      .primary()
      .unique();
    userTable.string("avatar_url");
    userTable.string("name").notNullable();
  });
};

exports.down = function(knex) {
  // dropping the user table
  return knex.schema.dropTable("users");
};
