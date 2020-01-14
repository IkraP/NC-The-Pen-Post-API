const { selectUserById } = require("../models/usersModel");

const sendUserById = (request, response, next) => {
  const { user_id } = request.params;
  selectUserById(user_id);
};
module.exports = { sendUserById };
