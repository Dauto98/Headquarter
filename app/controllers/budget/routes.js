const express = require("express");
const router = express.Router();
const controller = require("./controller.js");

router.get("/:from?/:to?", controller.getTransactions);

router.post("/create", controller.createTransaction);

module.exports = router;
