const express = require("express");
const router = express.Router();
const controller = require("./controller.js");

router.get("/:type", controller.findAll);

router.get("/id/:id", controller.findId);

router.post("/create", controller.create);

router.put("/update/:id", controller.update);

router.delete("/remove/:id", controller.remove);

module.exports = router;
