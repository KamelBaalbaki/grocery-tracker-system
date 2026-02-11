import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  PlusCircle, 
  Bell, 
  ChefHat, 
  BarChart3, 
  Settings 
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/grocery-list', icon: ShoppingCart, label: 'Grocery List' },
    { to: '/add-item', icon: PlusCircle, label: 'Add Item' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
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
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
