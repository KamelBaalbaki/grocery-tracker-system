import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChefHat, ExternalLink, Clock, Users } from 'lucide-react';
import { itemsAPI } from '../services/api';

const Recipes = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('ingredient') || '');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const sampleRecipes = [
    { id: 1, name: 'Chicken Stir Fry', tags: ['chicken', 'vegetables'], time: '25 min', servings: 4, dietary: 'High Protein' },
    { id: 2, name: 'Greek Yogurt Parfait', tags: ['yogurt', 'fruits'], time: '10 min', servings: 2, dietary: 'Vegetarian' },
    { id: 3, name: 'Banana Oat Smoothie', tags: ['banana', 'oats', 'milk'], time: '5 min', servings: 1, dietary: 'Vegan' },
    { id: 4, name: 'Grilled Steak', tags: ['steak', 'meat'], time: '30 min', servings: 2, dietary: 'High Protein' },
    { id: 5, name: 'Fresh Fruit Salad', tags: ['fruit', 'healthy'], time: '15 min', servings: 4, dietary: 'Vegan' },
    { id: 6, name: 'Protein Power Shake', tags: ['protein powder', 'milk'], time: '5 min', servings: 1, dietary: 'High Protein' },
    { id: 7, name: 'Apple Cinnamon Oatmeal', tags: ['oats', 'apple'], time: '15 min', servings: 2, dietary: 'Vegan' },
    { id: 8, name: 'Overnight Oats', tags: ['oats', 'milk', 'yogurt'], time: '5 min', servings: 1, dietary: 'Vegetarian' },
  ];

  const [filteredRecipes, setFilteredRecipes] = useState(sampleRecipes);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [searchQuery]);

  const fetchItems = async () => {
    try {
      const data = await itemsAPI.getAll();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    if (!searchQuery.trim()) {
      setFilteredRecipes(sampleRecipes);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = sampleRecipes.filter(recipe =>
      recipe.name.toLowerCase().includes(query) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(query))
    );
    setFilteredRecipes(filtered);
  };

  const getExpiringItems = () => {
    const now = new Date();
    const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return items
      .filter(item => {
        const expiry = new Date(item.expiryDate);
        return expiry > now && expiry <= sevenDays;
      })
      .slice(0, 6);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const expiringItems = getExpiringItems();

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Recipe Ideas</h1>
        <p className="page-subtitle">Find recipes using ingredients you have</p>
      </div>

      {/* Expiring Items Quick Filter */}
      {expiringItems.length > 0 && (
        <div className="insights-card" style={{ marginBottom: '1.5rem' }}>
          <div className="insights-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock size={20} style={{ color: 'var(--warning)' }} />
            <span>Use These Soon</span>
          </div>
          <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {expiringItems.map(item => (
              <button
                key={item._id}
                className="btn btn-sm btn-secondary"
                onClick={() => setSearchQuery(item.name)}
                style={{ 
                  borderColor: searchQuery === item.name ? 'var(--primary)' : 'var(--border)',
                  background: searchQuery === item.name ? 'rgba(124, 58, 237, 0.2)' : 'transparent'
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="table-container">
        <div className="table-header">
          <div className="search-box" style={{ maxWidth: '400px' }}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by ingredient or recipe name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredRecipes.length > 0 ? (
          <div style={{ padding: '0.5rem' }}>
            {filteredRecipes.map((recipe) => (
              <div 
                key={recipe.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid var(--border)',
                  transition: 'var(--transition)',
                  cursor: 'pointer'
                }}
                className="recipe-row"
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--primary-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ChefHat size={24} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {recipe.name}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {recipe.tags.join(' • ')}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Clock size={14} />
                    <span style={{ fontSize: '0.875rem' }}>{recipe.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Users size={14} />
                    <span style={{ fontSize: '0.875rem' }}>{recipe.servings}</span>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: 'var(--success-bg)',
                    color: 'var(--success)',
                    borderRadius: '50px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {recipe.dietary}
                  </span>
                  <button className="btn btn-sm btn-secondary">
                    View <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <ChefHat size={80} />
            <h3>No recipes found</h3>
            <p>Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;
