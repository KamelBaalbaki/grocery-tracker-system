import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout Components
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GroceryList from './pages/GroceryList';
import AddItem from './pages/AddItem';
import Notifications from './pages/Notifications';
import Recipes from './pages/Recipes';
import EcoInsights from './pages/EcoInsights';
import Settings from './pages/Settings';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Dashboard Layout Component
const DashboardLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />} 
      />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/grocery-list"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GroceryList />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-item"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AddItem />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-item/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AddItem />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Notifications />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/recipes"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Recipes />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/eco-insights"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <EcoInsights />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
