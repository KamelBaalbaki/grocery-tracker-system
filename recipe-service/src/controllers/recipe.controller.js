const recipeService = require('../services/recipe.service');

const findByIngredients = async (req, res) => {
  try {
    const { items, limit = 5 } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    const recipes = await recipeService.findByIngredients(items, limit);

    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

const getRecipeDetails = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const recipe = await recipeService.getRecipeDetails(recipeId);

    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch recipe details" });
  }
};

module.exports = {
  findByIngredients,
  getRecipeDetails
};
