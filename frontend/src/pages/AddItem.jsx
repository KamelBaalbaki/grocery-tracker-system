import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { itemsAPI } from "../services/api";
import {
  Minus,
  Plus,
  Save,
  X,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

const AddItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: "",
    quantity: 1,
    price: 0,
    purchaseDate: "",
    expiryDate: "",
    category: "",
    reminderDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Dairy",
    "Meat",
    "Produce",
    "Bakery",
    "Frozen",
    "Beverages",
    "Snacks",
    "Canned Goods",
    "Grains",
    "Condiments",
    "Other",
  ];

  useEffect(() => {
    if (isEditing) fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const items = await itemsAPI.getAll();
      const item = items.find((i) => i._id === id);

      if (item) {
        setFormData({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          purchaseDate: item.purchaseDate
            ? item.purchaseDate.split("T")[0]
            : "",
          expiryDate: item.expiryDate
            ? item.expiryDate.split("T")[0]
            : "",
          category: item.category,
        });
      }
    } catch (error) {
      console.error("Failed to fetch item:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleQuantityChange = (delta) => {
    setFormData((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (
      !formData.name ||
      !formData.purchaseDate ||
      !formData.expiryDate ||
      !formData.category
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (new Date(formData.expiryDate) <= new Date(formData.purchaseDate)) {
      setError("Expiry date must be after purchase date");
      setLoading(false);
      return;
    }

    try {
      const itemData = {
        name: formData.name,
        quantity: formData.quantity,
        price: parseFloat(formData.price) || 0,
        purchaseDate: formData.purchaseDate,
        expiryDate: formData.expiryDate,
        category: formData.category,
      };

      if (isEditing) {
        await itemsAPI.update(id, itemData);
      } else {
        await itemsAPI.create(itemData);
      }

      navigate("/grocery-list");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      quantity: 1,
      price: 0,
      purchaseDate: "",
      expiryDate: "",
      category: "",
      reminderDate: "",
    });
    setError("");
  };

  return (
    <div className="flex items-center justify-center min-h-full px-6">

      <div className="w-full max-w-xl bg-primary/20 glass glass-strong backdrop-blur-xl border border-border rounded-2xl p-8 shadow-xl">

        {/* Title */}
        <h1 className="text-3xl font-bold text-primary text-center mb-2">
          {isEditing ? "Edit Item" : "Add New Item"}
        </h1>

        <p className="text-muted-foreground text-center mb-8">
          {isEditing
            ? "Update your grocery item"
            : "Track a new grocery item"}
        </p>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-400/30 rounded-lg p-3 mb-6 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Item Name *
            </label>

            <input
              type="text"
              name="name"
              placeholder="e.g., Organic Milk"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white/40 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Quantity
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                className="p-2 rounded-lg border border-border hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <Minus size={18} />
              </button>

              <input
                type="number"
                value={formData.quantity}
                min="1"
                className="w-20 text-center px-3 py-2 rounded-lg border border-border bg-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Math.max(
                      1,
                      parseInt(e.target.value) || 1
                    ),
                  }))
                }
              />

              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                className="p-2 rounded-lg border border-border hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Price ($)
            </label>

            <input
              type="number"
              name="price"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium mb-1">
                Date Added *
              </label>

              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Expiry Date *
              </label>

              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category *
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            >
              <option value="">Select category...</option>

              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex w-full gap-3 pt-4">

            <button
              type="button"
              onClick={() => navigate("/grocery-list")}
              className="flex flex-grow justify-center items-center gap-2 px-4 py-2 rounded-xl bg-white border border-border hover:scale-[1.02] transition duration-500 hover:shadow-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex flex-grow justify-center items-center gap-2 p-3 rounded-xl bg-primary text-white font-semibold hover:scale-[1.02] transition duration-500 hover:shadow-xl"
            >
              {isEditing ? "Update Item" : "Add Item"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddItem;