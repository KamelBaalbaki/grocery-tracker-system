const express = require('express');
const protect = require('../middleware/auth.middleware');
const recipeProxy = require('../proxy/recipe.proxy');

const router = express.Router();

router.use(protect);
router.use('/', recipeProxy);

module.exports = router;
