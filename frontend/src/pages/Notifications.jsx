import { useState, useEffect } from 'react';
import { itemsAPI } from '../services/api';
import { Bell, Clock, Edit3 } from 'lucide-react';

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const itemsData = await itemsAPI.getAll();
      const sortedItems = itemsData.sort(
        (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
      );
      setItems(sortedItems);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Expired', color: 'var(--danger)' };
    if (diffDays === 0) return { text: 'Today!', color: 'var(--danger)' };
    if (diffDays === 1) return { text: '1 day', color: 'var(--danger)' };
    if (diffDays <= 3) return { text: `${diffDays} days`, color: 'var(--danger)' };
    if (diffDays <= 7) return { text: `${diffDays} days`, color: 'var(--warning)' };
    return { text: `${diffDays} days`, color: 'var(--success)' };
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
        <h1 className="page-title">Notifications</h1>
        <p className="page-subtitle">Track expiry dates for all your items</p>
      </div>

      <div className="table-container">
        {items.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Time Until Expiry</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const expiry = getDaysUntilExpiry(item.expiryDate);
                return (
                  <tr key={item._id}>
                    <td className="item-name">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--primary-gradient)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Bell size={16} color="white" />
                        </div>
                        {item.name}
                      </div>
                    </td>
                    <td>{item.quantity}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={14} style={{ color: expiry.color }} />
                        <span style={{ color: expiry.color, fontWeight: 600 }}>
                          {expiry.text}
                        </span>
                      </div>
                    </td>
                    <td>{formatDate(item.expiryDate)}</td>
                    <td>
                      <div className="progress-bar" style={{ width: '80px' }}>
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: expiry.text === 'Expired' ? '100%' : 
                                   parseInt(expiry.text) <= 3 ? '80%' :
                                   parseInt(expiry.text) <= 7 ? '50%' : '25%',
                            background: expiry.color
                          }}
                        ></div>
                      </div>
                    </td>
                    <td>
                      <button className="action-btn edit">
                        <Edit3 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <Bell size={80} />
            <h3>No notifications</h3>
            <p>Add some items to start tracking their expiry dates</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
