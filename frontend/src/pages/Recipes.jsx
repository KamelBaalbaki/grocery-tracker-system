import { useState, useEffect } from "react";
import { ChefHat, Clock, Users, X } from "lucide-react";
import { itemsAPI, recipesAPI } from "../services/api";

const Recipes = () => {
  const [items, setItems] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchItemsAndRecipes();
  }, []);

  const fetchItemsAndRecipes = async () => {
    try {
      const groceryItems = await itemsAPI.getAll();
      setItems(groceryItems);

      const itemNames = groceryItems.map((i) => i.name);

      if (itemNames.length > 0) {
        const recipeResults = await recipesAPI.getSuggestions(itemNames, 8);
        setRecipes(recipeResults);
      }
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const openRecipeDetails = async (recipeId) => {
    try {
      setDetailsLoading(true);
      setShowModal(true);

      const details = await recipesAPI.getById(recipeId);
      setSelectedRecipe(details);
    } catch (error) {
      console.error("Failed to fetch recipe details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">
            Smart Recipe Suggestions
          </h1>

          <p className="text-muted-foreground text-sm mt-1">
            Based on your grocery list ingredients
          </p>
        </div>
      </div>

      {/* RECIPES LIST */}

      {recipes.length > 0 ? (

        <div className="grid md:grid-cols-2 gap-6">

          {recipes.map((recipe) => (

            <div
              key={recipe.id}
              onClick={() => openRecipeDetails(recipe.id)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md hover:bg-primary/40 glass glass-strong transition cursor-pointer p-4 flex gap-4 items-center"
            >

              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-24 h-24 rounded-xl object-cover"
              />

              <div className="flex-1">

                <h3 className="font-semibold">
                  {recipe.title}
                </h3>

                <p className="text-xs text-muted-foreground mt-1">
                  Uses {recipe.usedIngredientCount} of your ingredients
                </p>

                <div className="flex flex-wrap gap-2 mt-2">

                  {recipe.usedIngredients?.map((ing, index) => (

                    <span
                      key={index}
                      className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600"
                    >
                      {ing.name}
                    </span>

                  ))}

                </div>

              </div>

              <ChefHat className="text-primary" size={22} />

            </div>

          ))}

        </div>

      ) : (

        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">

          <ChefHat size={70} className="opacity-40 mb-6" />

          <h3 className="text-lg font-semibold">
            No recipes found
          </h3>

          <p className="text-sm">
            Add more grocery items to get better suggestions
          </p>

        </div>

      )}

      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-[800px] max-h-[85vh] overflow-y-auto p-8 relative shadow-xl">

            <button
              onClick={() => {
                setShowModal(false);
                setSelectedRecipe(null);
              }}
              className="absolute top-5 right-5 p-2 hover:scale-[1.15] transition duration-500"
            >
              <X />
            </button>

            {detailsLoading ? (

              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
              </div>

            ) : (

              selectedRecipe && (

                <div className="space-y-6">

                  <h2 className="text-2xl font-bold">
                    {selectedRecipe.title}
                  </h2>

                  <div className="flex gap-6 text-sm text-muted-foreground">

                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {selectedRecipe.totalTime || "N/A"} mins
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      {selectedRecipe.servings} servings
                    </div>

                  </div>

                  <div>

                    <h3 className="font-semibold mb-2">
                      Ingredients
                    </h3>

                    <ul className="list-disc pl-5 space-y-1 text-sm">

                      {selectedRecipe.ingredients?.map((ing, index) => (
                        <li key={index}>{ing.amount}</li>
                      ))}

                    </ul>

                  </div>

                  <div>

                    <h3 className="font-semibold mb-2">
                      Instructions
                    </h3>

                    <ol className="list-decimal pl-5 space-y-2 text-sm">

                      {selectedRecipe.instructions?.map((step) => (
                        <li key={step.number}>{step.step}</li>
                      ))}

                    </ol>

                  </div>

                </div>

              )

            )}

          </div>

        </div>

      )}

    </div>
  );
};

export default Recipes;