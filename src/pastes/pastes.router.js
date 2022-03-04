const router = require("express").Router();
const controller = require("./pastes.controller");

router.route("/").get(controller.list).post(controller.create);

module.exports = router;
