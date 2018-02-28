const express = require('express');
const router = express.Router();
const controller = require('./controller.js')

router.post('/shell', controller.execShell);

module.exports = router;
