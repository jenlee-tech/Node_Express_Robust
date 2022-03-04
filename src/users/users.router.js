const router = require("express").Router();

const controller = require("./users.controller");

router.route("/:userId").get(controller.read);
router.route("/".get(controller.list));
module.exports = router;
