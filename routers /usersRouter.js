const usersRouter = require("express").Router();

const { sendUsername } = require("../controllers/usersController");

usersRouter.route("/:username").get(sendUsername);

module.exports = usersRouter;
