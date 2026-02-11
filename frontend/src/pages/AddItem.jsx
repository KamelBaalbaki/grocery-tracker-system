import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import { Minus, Plus, Save, X, RotateCcw, AlertCircle } from 'lucide-react';

const AddItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    price: 0,
    purchaseDate: '',
    expiryDate: '',
    category: '',
    reminderDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Dairy',
    'Meat',
    'Produce',
    'Bakery',
    'Frozen',
    'Beverages',
    'Snacks',
    'Canned Goods',
    'Grains',
    'Condiments',
    'Other',
  ];

  const reminderOptions = [
    { value: '', label: 'Select reminder...' },
    { value: '1', label: '1 day before' },
    { value: '2', label: '2 days before' },
    { value: '3', label: '3 days before' },
    { value: '7', label: '1 week before' },
    { value: '14', label: '2 weeks before' },
  ];

  useEffect(() => {
    if (isEditing) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      const items = await itemsAPI.getAll();
      const item = items.find(i => i._id === id);
      if (item) {
        setFormData({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          purchaseDate: item.purchaseDate ? item.purchaseDate.split('T')[0] : '',
          expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
          category: item.category,
          reminderDate: item.reminderDate ? item.reminderDate.split('T')[0] : '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch item:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleQuantityChange = (delta) => {
    setFormData(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta),
    }));
  };

  const calculateReminderDate = (expiryDate, daysBefore) => {
    if (!expiryDate || !daysBefore) return '';
    const expiry = new Date(expiryDate);
    expiry.setDate(expiry.getDate() - parseInt(daysBefore));
    return expiry.toISOString().split('T')[0];
  };

  const handleReminderChange = (e) => {
    const daysBefore = e.target.value;
    const reminderDate = calculateReminderDate(formData.expiryDate, daysBefore);
    setFormData(prev => ({ ...prev, reminderDate }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.purchaseDate || !formData.expiryDate || !formData.category) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (new Date(formData.expiryDate) <= new Date(formData.purchaseDate)) {
      setError('Expiry date must be after purchase date');
      setLoading(false);
      return;
    }

    try {
      const itemData = {
        name: formData.name,
        quantity: formData.quantity,
        price: parseFloat(formData.price) || 0,
        purchaseDate: formData.purchaseDate,
        expiryDate: formData.expiryDate,
        category: formData.category,
      };

      if (formData.reminderDate) {
        itemData.reminderDate = formData.reminderDate;
      }

      if (isEditing) {
        await itemsAPI.update(id, itemData);
      } else {
        await itemsAPI.create(itemData);
      }

      navigate('/grocery-list');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      name: '',
      quantity: 1,
      price: 0,
      purchaseDate: '',
      expiryDate: '',
      category: '',
      reminderDate: '',
    });
    setError('');
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">{isEditing ? 'Edit Item' : 'Add New Item'}</h1>
        <p className="page-subtitle">
          {isEditing ? 'Update item details' : 'Track a new grocery item'}
        </p>
      </div>

      <div className="form-card">
        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Item Name *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g., Organic Milk"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Quantity</label>
            <div className="quantity-input">
              <button 
                type="button" 
                className="quantity-btn"
                onClick={() => handleQuantityChange(-1)}
              >
                <Minus size={18} />
              </button>
              <input
                type="number"
                className="quantity-value"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  quantity: Math.max(1, parseInt(e.target.value) || 1) 
                }))}
                min="1"
              />
              <button 
                type="button" 
                className="quantity-btn"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="form-row">
            <label>Price ($)</label>
            <input
              type="number"
              name="price"
              className="form-input"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              style={{ maxWidth: '160px' }}
            />
          </div>

          <div className="form-row">
            <label>Date Added *</label>
            <input
              type="date"
              name="purchaseDate"
              className="form-input"
              value={formData.purchaseDate}
              onChange={handleChange}
              required
              style={{ maxWidth: '200px' }}
            />
          </div>

          <div className="form-row">
            <label>Expiry Date *</label>
            <input
              type="date"
              name="expiryDate"
              className="form-input"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              style={{ maxWidth: '200px' }}
            />
          </div>

          <div className="form-row">
            <label>Category *</label>
            <select
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
              required
              style={{ maxWidth: '200px' }}
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label>Reminder</label>
            <select
              className="form-select"
              onChange={handleReminderChange}
              defaultValue=""
              style={{ maxWidth: '200px' }}
            >
              {reminderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/grocery-list')}
            >
              <X size={18} />
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClear}
            >
              <RotateCcw size={18} />
              Clear
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ marginLeft: 'auto' }}
            >
              {loading ? (
                <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span>
              ) : (
                <>
                  <Save size={18} />
                  {isEditing ? 'Update Item' : 'Add Item'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
