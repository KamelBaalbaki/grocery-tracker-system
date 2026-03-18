import { useState, useEffect } from "react";
import { itemsAPI } from "../services/api";
import {
  Leaf,
  Lightbulb,
  Droplets,
  Wind,
  TrendingUp,
  Award,
  Target,
} from "lucide-react";

const EcoInsights = () => {
  const [stats, setStats] = useState({
    totalItemsAdded: 0,
    totalItemsSaved: 0,
    totalMoneySaved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const items = await itemsAPI.getAll();

      const totalItemsAdded = items.length;
      const now = new Date();

      const itemsNotExpired = items.filter(
        (item) => new Date(item.expiryDate) >= now,
      ).length;

      const totalMoneySaved = items
        .filter((item) => new Date(item.expiryDate) >= now)
        .reduce((sum, item) => sum + (item.price || 0), 0);

      setStats({
        totalItemsAdded,
        totalItemsSaved: Math.floor(itemsNotExpired * 0.6),
        totalMoneySaved: totalMoneySaved.toFixed(2),
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const impactStats = [
    {
      icon: Wind,
      label: "CO₂ Prevented",
      value: `${(stats.totalItemsSaved * 2.5).toFixed(1)} kg`,
    },
    {
      icon: Droplets,
      label: "Water Saved",
      value: `${(stats.totalItemsSaved * 100).toFixed(0)} L`,
    },
    {
      icon: Leaf,
      label: "Waste Prevented",
      value: `${(stats.totalItemsSaved * 0.5).toFixed(1)} kg`,
    },
  ];

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
      <div>
        <h1 className="text-3xl font-bold text-gradient">Eco Insights</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your environmental impact
        </p>
      </div>

      {/* MAIN STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Target size={20} />
            </div>
            <span className="text-sm text-muted-foreground">Items Tracked</span>
          </div>

          <div className="text-2xl font-bold">{stats.totalItemsAdded}</div>

          <p className="text-xs text-muted-foreground mt-1">
            Total items added
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-green-600">
              <Award size={20} />
            </div>
            <span className="text-sm text-muted-foreground">Items Saved</span>
          </div>

          <div className="text-2xl font-bold">{stats.totalItemsSaved}</div>

          <p className="text-xs text-muted-foreground mt-1">
            From going to waste
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-green-600">
              <TrendingUp size={20} />
            </div>
            <span className="text-sm text-muted-foreground">Money Saved</span>
          </div>

          <div className="text-2xl font-bold">${stats.totalMoneySaved}</div>

          <p className="text-xs text-muted-foreground mt-1">
            In prevented waste
          </p>
        </div>
      </div>

      {/* ENVIRONMENTAL IMPACT */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Leaf className="text-green-600" size={20} />
          <h2 className="font-semibold">Environmental Impact</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {impactStats.map((stat, index) => (
            <div
              key={index}
              className="bg-primary/20 glass glass-strong rounded-xl p-5 text-center hover:scale-[1.03] transition"
            >
              <stat.icon className="mx-auto mb-3 text-primary" size={28} />

              <div className="text-xl font-bold">{stat.value}</div>

              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TIPS */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="text-green-600" size={20} />
          <h2 className="font-semibold">Tips to Reduce Food Waste</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Plan your meals before shopping",
            "Store food properly to extend freshness",
            "Use the 'first in, first out' method",
            "Freeze items before they expire",
            "Get creative with leftovers",
            "Compost food scraps when possible",
          ].map((tip, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-primary/20 glass-strong glass rounded-xl p-4"
            >
              <div className="w-7 h-7 flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                {index + 1}
              </div>

              <span className="text-sm text-muted-foreground">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EcoInsights;
