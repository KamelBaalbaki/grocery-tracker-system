import { useState, useEffect } from 'react';
import { itemsAPI } from '../services/api';
import { Leaf, Droplets, Wind, TrendingUp, Award, Target } from 'lucide-react';

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
        item => new Date(item.expiryDate) >= now
      ).length;
      
      const totalMoneySaved = items
        .filter(item => new Date(item.expiryDate) >= now)
        .reduce((sum, item) => sum + (item.price || 0), 0);

      setStats({
        totalItemsAdded,
        totalItemsSaved: Math.floor(itemsNotExpired * 0.6),
        totalMoneySaved: totalMoneySaved.toFixed(2),
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const impactStats = [
    {
      icon: Wind,
      label: 'CO₂ Prevented',
      value: `${(stats.totalItemsSaved * 2.5).toFixed(1)} kg`,
      color: 'var(--primary)',
      bg: 'rgba(124, 58, 237, 0.15)'
    },
    {
      icon: Droplets,
      label: 'Water Saved',
      value: `${(stats.totalItemsSaved * 100).toFixed(0)} L`,
      color: 'var(--info)',
      bg: 'var(--info-bg)'
    },
    {
      icon: Leaf,
      label: 'Waste Prevented',
      value: `${(stats.totalItemsSaved * 0.5).toFixed(1)} kg`,
      color: 'var(--success)',
      bg: 'var(--success-bg)'
    },
  ];

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
        <h1 className="page-title">Eco Insights</h1>
        <p className="page-subtitle">Track your environmental impact</p>
      </div>

      {/* Main Stats */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon primary">
              <Target size={22} />
            </div>
            <span className="stat-label">Items Tracked</span>
          </div>
          <div className="stat-value">{stats.totalItemsAdded}</div>
          <div className="stat-subtitle">Total items added</div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon success">
              <Award size={22} />
            </div>
            <span className="stat-label">Items Saved</span>
          </div>
          <div className="stat-value">{stats.totalItemsSaved}</div>
          <div className="stat-subtitle">From going to waste</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon info">
              <TrendingUp size={22} />
            </div>
            <span className="stat-label">Money Saved</span>
          </div>
          <div className="stat-value">${stats.totalMoneySaved}</div>
          <div className="stat-subtitle">In prevented waste</div>
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="insights-card">
        <div className="insights-header">
          <Leaf size={20} style={{ color: 'var(--success)', marginRight: '0.75rem' }} />
          Environmental Impact
        </div>
        
        <div style={{ padding: '1rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {impactStats.map((stat, index) => (
              <div 
                key={index}
                style={{
                  padding: '1.5rem',
                  background: stat.bg,
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center'
                }}
              >
                <stat.icon size={32} style={{ color: stat.color, marginBottom: '0.75rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="insights-card" style={{ marginTop: '1.5rem' }}>
        <div className="insights-header">
          💡 Tips to Reduce Food Waste
        </div>
        
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {[
              'Plan your meals before shopping',
              'Store food properly to extend freshness',
              'Use the "first in, first out" method',
              'Freeze items before they expire',
              'Get creative with leftovers',
              'Compost food scraps when possible'
            ].map((tip, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {index + 1}
                </div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoInsights;
