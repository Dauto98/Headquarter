const express = require('express');
const router = express.Router();
const controller = require('./controller.js')

router.get('/', controller.findAll);

router.post('/create', controller.create);

router.delete('/remove/:id', controller.remove)

module.exports = router;
