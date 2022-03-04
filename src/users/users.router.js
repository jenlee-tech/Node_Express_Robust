const router = require("express").Router();

const controller = require("./users.controller");

const methodNotAllowed = require("../errors/methodNotAllowed");

const pastesRouter = require("../pastes/pastes.router");

router.use("/:userID/pastes", pastesRouter);

router.route("/:userId").get(controller.read).all(methodNotAllowed);

router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;
