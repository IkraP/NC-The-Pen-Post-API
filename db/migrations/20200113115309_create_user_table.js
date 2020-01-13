exports.up = function(knex) {
  // creating a user table
  console.log("creating a user table");
  return knex.schema.createTable("users", userTable => {
    userTable
      .string("username")
      .primary()
      .unique();
    userTable.string("avatar_url").notNullable();
    userTable.string("name");
  });
};

exports.down = function(knex) {
  // dropping the user table
  console.log("Dropping the user table");
  return knex.schema.dropTable("users");
};
