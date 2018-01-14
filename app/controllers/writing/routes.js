const express = require('express');
const router = express.Router();
const controller = require('./controller.js')

router.get('/', controller.findAll);

router.get('/:id', controller.findId);

router.post('/create', controller.create);

router.put('/update/:id', controller.update);

router.delete('/remove/:id', controller.remove);

module.exports = router;
