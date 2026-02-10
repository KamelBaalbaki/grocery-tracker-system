const express = require('express');
const recipeController = require('../controllers/recipe.controller');

const router = express.Router();

router.post('/suggestions', recipeController.findByIngredients);
router.get("/:recipeId", recipeController.getRecipeDetails);

module.exports = router;
