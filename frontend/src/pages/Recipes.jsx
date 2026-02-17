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
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Smart Recipe Suggestions</h1>
        <p className="page-subtitle">Based on your grocery list ingredients</p>
      </div>

      <div className="table-container">
        {recipes.length > 0 ? (
          <div style={{ padding: "1rem" }}>
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => openRecipeDetails(recipe.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.25rem",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                className="recipe-row"
              >
                <div style={{ display: "flex", gap: "1rem" }}>
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    style={{
                      width: "90px",
                      height: "90px",
                      borderRadius: "14px",
                      objectFit: "cover",
                    }}
                  />

                  <div>
                    <div style={{ fontWeight: 600 }}>{recipe.title}</div>

                    <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                      Uses {recipe.usedIngredientCount} of your ingredients
                    </div>

                    {recipe.usedIngredients?.map((ing, index) => (
                      <span
                        key={index}
                        style={{
                          fontSize: "0.7rem",
                          padding: "4px 8px",
                          borderRadius: "20px",
                          background: "rgba(34,197,94,0.15)",
                          color: "#22c55e",
                          marginRight: "6px",
                        }}
                      >
                        {ing.name}
                      </span>
                    ))}
                  </div>
                </div>

                <ChefHat size={22} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <ChefHat size={80} />
            <h3>No recipes found</h3>
            <p>Add more grocery items to get better suggestions</p>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="modern-modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modern-modal"
            style={{
              width: "75%",
              maxHeight: "90vh",
              background: "var(--bg-card)",
              borderRadius: "20px",
              padding: "2rem",
              overflowY: "auto",
              position: "relative",
              boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
            }}
          >
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedRecipe(null);
              }}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <X />
            </button>

            {detailsLoading ? (
              <div className="spinner" />
            ) : (
              selectedRecipe && (
                <>
                  <h2 style={{ marginBottom: "1rem" }}>
                    {selectedRecipe.title}
                  </h2>

                  <div
                    style={{
                      display: "flex",
                      gap: "2rem",
                      marginBottom: "1.5rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <div>
                      <Clock size={16} /> {selectedRecipe.totalTime || "N/A"}{" "}
                      mins
                    </div>
                    <div>
                      <Users size={16} /> {selectedRecipe.servings} servings
                    </div>
                  </div>

                  <h3>Ingredients</h3>
                  <ul>
                    {selectedRecipe.ingredients?.map((ing, index) => (
                      <li key={index}>{ing.amount}</li>
                    ))}
                  </ul>

                  <h3 style={{ marginTop: "1.5rem" }}>Instructions</h3>
                  <ol>
                    {selectedRecipe.instructions?.map((step) => (
                      <li key={step.number} style={{ marginBottom: "0.75rem" }}>
                        {step.step}
                      </li>
                    ))}
                  </ol>
                </>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
