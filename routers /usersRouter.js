const usersRouter = require("express").Router();

const { sendUsernameById } = require("../controllers/usersController");

usersRouter.route("/:username").get(sendUsernameById);

module.exports = usersRouter;
