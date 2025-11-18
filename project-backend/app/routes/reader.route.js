const express = require("express");
const router = express.Router();
const reader = require("../controllers/reader.controller");

router.route("/")
    .get(reader.findAll)
    .post(reader.create)
    .delete(reader.deleteAll);
router.route("/:id")
    .get(reader.findOne)
    .put(reader.update)
    .delete(reader.delete);

module.exports = router;