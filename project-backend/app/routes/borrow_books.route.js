const express = require("express");
const router = express.Router();
const borrowBooksController = require("../controllers/borrow_books.controller");

router
  .route("/")
  .get(borrowBooksController.findAll)
  .post(borrowBooksController.create);
router
  .route("/:id")
  .get(borrowBooksController.findOne)
  .put(borrowBooksController.update)
  .delete(borrowBooksController.delete);
router.route("/ma-doc-gia/:MaDocGia").get(borrowBooksController.findByMaDocGia);

module.exports = router;
