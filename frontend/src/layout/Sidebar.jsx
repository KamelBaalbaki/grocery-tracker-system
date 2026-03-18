import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  ShoppingCart,
  PlusCircle,
  Bell,
  ChefHat,
  BarChart3,
  Settings,
  Clock,
  LogOut,
  Leaf,
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/grocery-list", icon: ShoppingCart, label: "Grocery List" },
    { to: "/add-item", icon: PlusCircle, label: "Add Item" },
    { to: "/notifications", icon: Bell, label: "Notifications" },
    { to: "/reminders", icon: Clock, label: "Reminders" },
    { to: "/recipes", icon: ChefHat, label: "Recipes" },
    { to: "/eco-insights", icon: BarChart3, label: "Eco Insights" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`
    : "U";

  return (
    <aside className="fixed left-0 top-0 bg-brand h-screen w-64 text-white flex flex-col glow-border glass">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 background-gradient rounded-b-xl">
        <Leaf size={28} className="text-white" />
        <span className="text-xl font-bold">Grocery Tracker</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-md font-medium transition 
                  ${
                    isActive
                      ? "text-primary bg-primary/20"
                      : "text-muted/70 hover:bg-primary/20 hover:text-primary"
                  }`
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 ">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-md font-medium transition text-muted/70 hover:bg-primary/20 hover:text-primary w-full"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>
    </aside>
  );
};

export default Sidebar;