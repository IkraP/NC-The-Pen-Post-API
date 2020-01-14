const connection = require("../db/connection");

const selectUsername = username => {
  return connection("users")
    .first("*")
    .where("username", username)
    .then(username => {
      if (!username) {
        return Promise.reject({
          status: 404,
          msg: "Invalid username"
        });
      } else return username;
    });
};

module.exports = { selectUsername };
