const express = require('express');
const router = express.Router();
const controller = require('./controller.js')

router.get('/', controller.findAll);

router.post('/create', controller.create);

module.exports = router;
