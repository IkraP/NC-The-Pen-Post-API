const usersRouter = require("express").Router();

const { sendUserById } = require("../controllers/usersController");

usersRouter.route("/:user_id").get(sendUserById);

module.exports = usersRouter;
