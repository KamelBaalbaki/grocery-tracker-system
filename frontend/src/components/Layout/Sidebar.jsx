import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { 
  LayoutDashboard, 
  ShoppingCart, 
  PlusCircle, 
  Bell, 
  ChefHat, 
  BarChart3, 
  Settings,
  Clock 
} from 'lucide-react';

const Sidebar = () => {
  const { hasNewNotification } = useAuth(); // 🔥 from context

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/grocery-list', icon: ShoppingCart, label: 'Grocery List' },
    { to: '/add-item', icon: PlusCircle, label: 'Add Item' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/reminders', icon: Clock, label: 'Reminders' },
    { to: '/recipes', icon: ChefHat, label: 'Recipes' },
    { to: '/eco-insights', icon: BarChart3, label: 'Eco Insights' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="sidebar">
      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink 
              to={item.to} 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <div className="flex items-center gap-2 relative">
                <item.icon size={20} />
                <span>{item.label}</span>

                {item.label === "Notifications" && hasNewNotification && (
                  <span className="absolute -top-1 -right-2 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;