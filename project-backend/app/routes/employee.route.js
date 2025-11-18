const express = require("express");
const router = express.Router();
const employee = require("../controllers/employee.controller");

router.route("/")
    .get(employee.findAll)
    .post(employee.create)
    .delete(employee.deleteAll);
router.route("/:id")
    .get(employee.findOne)
    .put(employee.update)
    .delete(employee.delete);

module.exports = router;