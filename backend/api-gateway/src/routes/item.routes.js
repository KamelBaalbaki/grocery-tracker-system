const express = require('express');
const protect = require('../middleware/auth.middleware');
const itemProxy = require('../proxy/item.proxy');

const router = express.Router();

router.use(protect);
router.use('/', itemProxy);

module.exports = router;
