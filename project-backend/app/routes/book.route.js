const express = require("express");
const router = express.Router();
const book = require("../controllers/book.controller");

router.route("/")
    .get(book.findAll)
    .post(book.create)
    .delete(book.deleteAll);
router.route("/:id")
    .get(book.findOne)
    .put(book.update)
    .delete(book.delete);
router.route("/tim-kiem").get(book.search);
router.route("/cap-nhat-so-luong").put(book.deductQuantity);

module.exports = router;