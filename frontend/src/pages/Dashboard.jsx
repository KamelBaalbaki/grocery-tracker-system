import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { itemsAPI, recipesAPI } from "../services/api";

import {
  AlertTriangle,
  Package,
  TrendingUp,
  Zap,
  Plus,
  List,
  BookOpen,
  BarChart3,
  Clock,
  Search,
  ChefHat,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    nextExpiring: null,
    recentlyAdded: 0,
    savedThisMonth: 0,
  });

  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await itemsAPI.getAll();
      setItems(data);
      calculateStats(data);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (itemsData) => {
    const now = new Date();

    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const sortedByExpiry = [...itemsData]
      .filter((item) => new Date(item.expiryDate) > now)
      .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

    const recentlyAdded = itemsData.filter(
      (item) => new Date(item.createdAt) > oneWeekAgo,
    ).length;

    const savedThisMonth = itemsData.filter((item) => {
      const created = new Date(item.createdAt);
      const expiry = new Date(item.expiryDate);

      return created >= startOfMonth && expiry >= now;
    }).length;

    setStats({
      nextExpiring: sortedByExpiry[0] || null,
      recentlyAdded,
      savedThisMonth,
    });
  };

  const getExpiringItems = () => {
    const now = new Date();
    const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return items
      .filter((item) => {
        const expiry = new Date(item.expiryDate);
        return expiry > now && expiry <= sevenDays;
      })
      .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
      .slice(0, 5);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const getDaysUntil = (date) =>
    Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));

  const expiringItems = getExpiringItems();

  // Open Recipe Modal
  const openRecipeModal = async (itemName) => {
    try {
      setShowRecipeModal(true);
      setDetailsLoading(true);
      setSelectedRecipe(null);
      console.log("Sending ingredient:", itemName);
      const results = await recipesAPI.getSuggestions([itemName], 6);
      setRecipes(results);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Open Recipe Details
  const openRecipeDetails = async (recipeId) => {
    try {
      setDetailsLoading(true);
      const details = await recipesAPI.getById(recipeId);
      setSelectedRecipe(details);
    } catch (error) {
      console.error("Failed to fetch recipe details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };


  if (loading)
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gradient">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your groceries
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Next Expiring */}
        <div className="bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <AlertTriangle size={20} />
            </div>
            <span className="text-lg">Next Expiring</span>
          </div>

          <p className="text-xl font-bold">
            {stats.nextExpiring?.name || "None"}
          </p>

          {stats.nextExpiring && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock size={14} />
              {getDaysUntil(stats.nextExpiring.expiryDate)} days left
            </p>
          )}
        </div>

        {/* Recently Added */}
        <div className="bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Package size={20} />
            </div>
            <span className="text-lg">Recently Added</span>
          </div>

          <p className="text-2xl font-bold">{stats.recentlyAdded}</p>
          <p className="text-sm text-muted-foreground">Items this week</p>
        </div>

        {/* Saved */}
        <div className="bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <TrendingUp size={20} />
            </div>
            <span className="text-lg">Food Saved</span>
          </div>

          <p className="text-2xl font-bold">{stats.savedThisMonth}</p>
          <p className="text-sm text-muted-foreground">Items this month</p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 font-semibold mb-4">
          <Zap size={18} />
          Quick Actions
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <Link
            to="/add-item"
            className="flex items-center justify-center gap-2 
            background-gradient text-white border py-3 rounded-xl btn
            hover:bg-primary/20 hover:border-primary transition duration-1000"
          >
            <Plus size={18} />
            Add Item
          </Link>

          <Link
            to="/grocery-list"
            className="flex items-center justify-center gap-2 
            bg-primary/20 text-primary border py-3 rounded-xl btn
            hover:bg-gradient-to-b hover:from-green-500 hover:to-green-700 hover:text-white transition duration-1000"
          >
            <List size={18} />
            View All
          </Link>

          <Link
            to="/recipes"
            className="flex items-center justify-center gap-2 
            bg-primary/20 text-primary border py-3 rounded-xl btn
            hover:bg-primary hover:text-white  transition duration-1000"
          >
            <BookOpen size={18} />
            Recipes
          </Link>

          <Link
            to="/eco-insights"
            className="flex items-center justify-center gap-2 
            bg-primary/20 text-primary border py-3 rounded-xl btn
            hover:bg-primary hover:text-white  transition duration-1000"
          >
            <BarChart3 size={18} />
            Insights
          </Link>
        </div>
      </div>

      {/* Expiring Item */}
      <div className="bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 font-semibold mb-4">
          <AlertTriangle size={18} />
          Expiring Soon
        </div>

        {expiringItems.length > 0 ? (
          <div className="space-y-3">
            {expiringItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center 
                bg-primary/20 glass glass-strong backdrop-blur rounded-xl p-4 hover:bg-primary/30 transition"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Expires {formatDate(item.expiryDate)}
                  </p>
                </div>

                <button
                  onClick={() => openRecipeModal(item.name)}
                  className="text-sm px-3 py-2 rounded-lg 
                  bg-primary border text-white btn 
                  hover:bg-primary/20 hover:text-primary hover:border-primary transition"
                >
                  Find Recipe
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No items expiring soon</p>
        )}
      </div>

      {/* Recipe Modal */}
       {showRecipeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[800px] max-h-[85vh] overflow-y-auto p-8 relative shadow-xl">
          
            <button
              onClick={() => {
                setShowRecipeModal(false);
                setRecipes([]);
                setSelectedRecipe(null);
              }}
              className="absolute top-5 right-5 p-2 hover:scale-[1.1]"
            >
              ✕
            </button>

    
            {detailsLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : selectedRecipe ? (
          
              <div className="space-y-6">
                <h2 className="text-2xl text-primary font-bold">
                  {selectedRecipe.title}
                </h2>

                <div>
                  <h3 className="font-semibold text-primary mb-2">
                    Ingredients
                  </h3>
                  <ul className="list-disc pl-5 text-sm">
                    {selectedRecipe.ingredients?.map((ing, i) => (
                      <li key={i} className="text-muted-foreground">
                        {ing.amount}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-primary mb-2">
                    Instructions
                  </h3>
                  <ol className="list-decimal pl-5 text-sm space-y-2">
                    {selectedRecipe.instructions?.map((step) => (
                      <li key={step.number} className="text-muted-foreground">
                        {step.step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search size={24} />
                  <h2 className="text-xl font-semibold">Recipes</h2>
                </div>

                {recipes.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <p className="text-lg font-medium">No recipes found</p>
                    <p className="text-sm mt-1">
                      Try another ingredient or check your connection
                    </p>
                  </div>
                ) : (
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
                          <h3 className="font-semibold">{recipe.title}</h3>

                          <p className="text-xs text-muted-foreground mt-1">
                            Uses {recipe.usedIngredientCount} of your
                            ingredients
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
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
