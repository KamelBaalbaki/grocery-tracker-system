const spoonacular = require('../config/spoonacular');
const normalizeIngredients = require('../utils/normalizeIngredients');

const findByIngredients = async (items, limit = 5) => {
  const ingredients = normalizeIngredients(items).join(',');

  const response = await spoonacular.get('/recipes/findByIngredients', {
    params: {
      ingredients,
      number: limit,
      ranking: 2,
      ignorePantry: true
    }
  });

  return response.data;
};

const getRecipeDetails = async (recipeId) => {
  const response = await spoonacular.get(
    `/recipes/${recipeId}/information`
  );

  const recipe = response.data;

  const cleanInstructions =
  recipe.analyzedInstructions?.[0]?.steps
    ?.filter(step =>
      step.step &&
      step.step.length > 10 &&
      !step.step.match(/var |Type_|article|init_|data\s*=/i)
    )
    .map((step, index) => ({
      number: index + 1,
      step: step.step.trim()
    })) || [];


  return {
    id: recipe.id,
    title: recipe.title,
    prepTime: recipe.preparationMinutes,
    cookingTime: recipe.cookingMinutes,
    totalTime: recipe.readyInMinutes,
    servings: recipe.servings,

    ingredients: recipe.extendedIngredients.map(i => ({
      name: i.name,
      amount: i.original
    })),

    instructions: cleanInstructions
  };
};

module.exports = {
  findByIngredients,
  getRecipeDetails
};
