const usersRouter = require("express").Router();
const { sendUsername } = require("../controllers/usersController");
const { send405Error } = require("../error_functions/errors");

usersRouter
  .route("/:username")
  .get(sendUsername)
  .all(send405Error);

module.exports = usersRouter;
