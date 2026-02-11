import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Leaf, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar">
      <Link to={isAuthenticated ? "/dashboard" : "/"} className="navbar-logo">
        <Leaf size={36} strokeWidth={1.5} />
        <span>Smart Grocery</span>
      </Link>

      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            <div className="navbar-user">
              <div className="navbar-avatar">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <span style={{ fontWeight: 500 }}>
                {user?.firstName}
              </span>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">Sign in</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
