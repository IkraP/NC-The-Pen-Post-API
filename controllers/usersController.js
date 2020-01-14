const { selectUsernameById } = require("../models/usersModel");

const sendUsernameById = (request, response, next) => {
  console.log(" I am in the controller");
  const { username } = request.params;
  console.log(username);
  selectUserById(username);
};
module.exports = { sendUsernameById };
