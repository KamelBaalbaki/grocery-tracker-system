const express = require('express');
const authProxy = require('../proxy/auth.proxy');

const router = express.Router();

router.use('/', authProxy);

module.exports = router;
