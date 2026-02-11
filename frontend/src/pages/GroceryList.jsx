import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { itemsAPI } from '../services/api';
import { Search, Plus, Package, Eye, Edit3, Trash2 } from 'lucide-react';

const GroceryList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, items]);

  const fetchItems = async () => {
    try {
      const data = await itemsAPI.getAll();
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  };

  const handleDelete = async (itemId) => {
    try {
      await itemsAPI.delete(itemId);
      setItems(prev => prev.filter(item => item._id !== itemId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getExpiryStatus = (expiryDate) => {
    const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { status: 'expired', color: 'var(--danger)', percent: 100 };
    if (days <= 3) return { status: 'critical', color: 'var(--danger)', percent: 90 };
    if (days <= 7) return { status: 'warning', color: 'var(--warning)', percent: 60 };
    return { status: 'good', color: 'var(--success)', percent: 30 };
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
        <h1 className="page-title">{user?.firstName}'s Grocery List</h1>
        <p className="page-subtitle">{items.length} items tracked</p>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link to="/add-item" className="btn btn-primary">
            <Plus size={18} />
            Add Item
          </Link>
        </div>

        {filteredItems.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Added</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const expiry = getExpiryStatus(item.expiryDate);
                return (
                  <tr key={item._id}>
                    <td className="item-name">{item.name}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '50px',
                        fontSize: '0.75rem'
                      }}>
                        {item.category}
                      </span>
                    </td>
                    <td>{item.quantity}</td>
                    <td>{formatDate(item.purchaseDate)}</td>
                    <td>{formatDate(item.expiryDate)}</td>
                    <td>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${expiry.percent}%`,
                            background: expiry.color
                          }}
                        ></div>
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="action-btn view"
                          onClick={() => navigate(`/edit-item/${item._id}`)}
                          title="View details"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          className="action-btn edit"
                          onClick={() => navigate(`/edit-item/${item._id}`)}
                          title="Edit item"
                        >
                          <Edit3 size={14} />
                        </button>
                        {deleteConfirm === item._id ? (
                          <>
                            <button 
                              className="action-btn delete"
                              onClick={() => handleDelete(item._id)}
                              style={{ background: 'var(--danger)', color: 'white' }}
                            >
                              Confirm
                            </button>
                            <button 
                              className="action-btn view"
                              onClick={() => setDeleteConfirm(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button 
                            className="action-btn delete"
                            onClick={() => setDeleteConfirm(item._id)}
                            title="Delete item"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <Package size={80} />
            <h3>No items found</h3>
            <p>Start tracking your groceries by adding your first item!</p>
            <Link to="/add-item" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              <Plus size={18} />
              Add Your First Item
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroceryList;
