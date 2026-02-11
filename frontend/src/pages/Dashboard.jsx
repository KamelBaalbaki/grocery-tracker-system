import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { itemsAPI } from '../services/api';
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
  ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    nextExpiring: null,
    recentlyAdded: 0,
    savedThisMonth: 0,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await itemsAPI.getAll();
      setItems(data);
      calculateStats(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (itemsData) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const sortedByExpiry = [...itemsData]
      .filter(item => new Date(item.expiryDate) > now)
      .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    
    const recentlyAdded = itemsData.filter(
      item => new Date(item.createdAt) > oneWeekAgo
    ).length;
    
    setStats({
      nextExpiring: sortedByExpiry[0] || null,
      recentlyAdded,
      savedThisMonth: 7,
    });
  };

  const getExpiringItems = () => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return items
      .filter(item => {
        const expiryDate = new Date(item.expiryDate);
        return expiryDate > now && expiryDate <= sevenDaysFromNow;
      })
      .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
      .slice(0, 5);
  };

  const formatDate = (date) => {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntil = (date) => {
    if (!date) return null;
    const days = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const expiringItems = getExpiringItems();

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
        <h1 className="page-title">Welcome back, {user?.firstName}! 👋</h1>
        <p className="page-subtitle">Here's what's happening with your groceries</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card danger">
          <div className="stat-header">
            <div className="stat-icon danger">
              <AlertTriangle size={22} />
            </div>
            <span className="stat-label">Next Expiring</span>
          </div>
          <div className="stat-value">
            {stats.nextExpiring?.name || 'None'}
          </div>
          <div className="stat-subtitle">
            {stats.nextExpiring ? (
              <>
                <Clock size={14} style={{ marginRight: '4px' }} />
                {getDaysUntil(stats.nextExpiring.expiryDate)} days left
              </>
            ) : 'All items fresh!'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon info">
              <Package size={22} />
            </div>
            <span className="stat-label">Recently Added</span>
          </div>
          <div className="stat-value">{stats.recentlyAdded}</div>
          <div className="stat-subtitle">Items this week</div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon success">
              <TrendingUp size={22} />
            </div>
            <span className="stat-label">Food Saved</span>
          </div>
          <div className="stat-value">{stats.savedThisMonth}</div>
          <div className="stat-subtitle">Items this month</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="section-header">
          <Zap size={20} />
          <span>Quick Actions</span>
        </div>
        <div className="quick-actions-grid">
          <Link to="/add-item" className="btn btn-primary">
            <Plus size={18} />
            Add Item
          </Link>
          <Link to="/grocery-list" className="btn btn-secondary">
            <List size={18} />
            View All
          </Link>
          <Link to="/recipes" className="btn btn-accent">
            <BookOpen size={18} />
            Recipes
          </Link>
          <Link to="/eco-insights" className="btn btn-secondary">
            <BarChart3 size={18} />
            Insights
          </Link>
        </div>
      </div>

      {/* Expiring Items */}
      <div className="expiring-section">
        <div className="expiring-header">
          <div className="expiring-title">
            <AlertTriangle size={20} />
            <span>Expiring Soon</span>
          </div>
          <Link to="/grocery-list" className="btn btn-ghost btn-sm">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        
        {expiringItems.length > 0 ? (
          <div>
            {expiringItems.map((item) => (
              <div key={item._id} className="expiring-item">
                <div>
                  <div className="expiring-name">{item.name}</div>
                  <div className="expiring-date">
                    Expires {formatDate(item.expiryDate)}
                  </div>
                </div>
                <Link 
                  to={`/recipes?ingredient=${item.name}`} 
                  className="btn btn-sm btn-secondary"
                >
                  Find Recipe
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <p>No items expiring soon. Great job! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
