const express = require('express');
const protect = require('../middleware/auth.middleware');
const userProxy = require('../proxy/user.proxy');

const router = express.Router();

router.use(protect);
router.use('/', userProxy);

module.exports = router;
