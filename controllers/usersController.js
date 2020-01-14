const { selectUsername } = require("../models/usersModel");

const sendUsername = (request, response, next) => {
  const { username } = request.params;
  selectUsername(username)
    .then(user => response.status(200).send({ user }))
    .catch(err => next(err));
};

module.exports = { sendUsername };
