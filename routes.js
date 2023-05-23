const express = require('express');
const router = express.Router();
const profileController = require('./Controller.js');

router.get('/', profileController.getProfile);

module.exports = router;
