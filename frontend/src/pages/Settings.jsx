import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Palette, LogOut, Trash2, Save, Check } from 'lucide-react';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    defaultReminderDays: '3',
    theme: 'dark',
  });
  
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your preferences</p>
      </div>

      {saved && (
        <div className="alert alert-success">
          <Check size={18} />
          Settings saved successfully!
        </div>
      )}

      {/* Profile Section */}
      <div className="insights-card" style={{ marginBottom: '1.5rem' }}>
        <div className="insights-header">
          <User size={20} style={{ marginRight: '0.75rem' }} />
          Profile
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'white'
            }}>
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                {user?.firstName} {user?.lastName}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {user?.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="insights-card" style={{ marginBottom: '1.5rem' }}>
        <div className="insights-header">
          <Bell size={20} style={{ marginRight: '0.75rem' }} />
          Notifications
        </div>

        <form onSubmit={handleSave}>
          <div className="insights-row">
            <div>
              <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Email Notifications</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Receive expiry alerts via email
              </div>
            </div>
            <label style={{ 
              position: 'relative', 
              width: '48px', 
              height: '28px', 
              cursor: 'pointer' 
            }}>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                inset: 0,
                background: settings.emailNotifications ? 'var(--primary)' : 'var(--bg-secondary)',
                borderRadius: '50px',
                transition: 'var(--transition)'
              }}>
                <span style={{
                  position: 'absolute',
                  left: settings.emailNotifications ? '22px' : '4px',
                  top: '4px',
                  width: '20px',
                  height: '20px',
                  background: 'white',
                  borderRadius: '50%',
                  transition: 'var(--transition)'
                }}></span>
              </span>
            </label>
          </div>

          <div className="insights-row">
            <div>
              <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Push Notifications</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Receive browser push notifications
              </div>
            </div>
            <label style={{ 
              position: 'relative', 
              width: '48px', 
              height: '28px', 
              cursor: 'pointer' 
            }}>
              <input
                type="checkbox"
                name="pushNotifications"
                checked={settings.pushNotifications}
                onChange={handleChange}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                inset: 0,
                background: settings.pushNotifications ? 'var(--primary)' : 'var(--bg-secondary)',
                borderRadius: '50px',
                transition: 'var(--transition)'
              }}>
                <span style={{
                  position: 'absolute',
                  left: settings.pushNotifications ? '22px' : '4px',
                  top: '4px',
                  width: '20px',
                  height: '20px',
                  background: 'white',
                  borderRadius: '50%',
                  transition: 'var(--transition)'
                }}></span>
              </span>
            </label>
          </div>

          <div className="insights-row">
            <div>
              <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Default Reminder</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                When to notify before expiry
              </div>
            </div>
            <select
              name="defaultReminderDays"
              value={settings.defaultReminderDays}
              onChange={handleChange}
              className="form-select"
              style={{ width: 'auto', minWidth: '150px' }}
            >
              <option value="1">1 day before</option>
              <option value="2">2 days before</option>
              <option value="3">3 days before</option>
              <option value="7">1 week before</option>
            </select>
          </div>

          <div style={{ padding: '1rem 1.5rem' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Appearance */}
      <div className="insights-card" style={{ marginBottom: '1.5rem' }}>
        <div className="insights-header">
          <Palette size={20} style={{ marginRight: '0.75rem' }} />
          Appearance
        </div>

        <div className="insights-row">
          <div>
            <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Theme</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Choose your preferred theme
            </div>
          </div>
          <select
            name="theme"
            value={settings.theme}
            onChange={handleChange}
            className="form-select"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="dark">Dark</option>
            <option value="light">Light (Coming Soon)</option>
          </select>
        </div>
      </div>

      {/* Account Actions */}
      <div className="insights-card">
        <div className="insights-header">
          ⚠️ Danger Zone
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
          <button 
            className="btn btn-secondary"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
          <button 
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                alert('Account deletion is not implemented yet.');
              }
            }}
          >
            <Trash2 size={18} />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
