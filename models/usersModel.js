const connection = require("../db/connection");

const selectUserById = user_id => {
  return connection("users")
    .where(user_id)
    .select("*")
    .then(username_selected => {
      console.log(username_selected);
    });
};

module.exports = { selectUserById };
