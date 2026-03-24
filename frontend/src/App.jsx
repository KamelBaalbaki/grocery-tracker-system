import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layout
import DashboardLayout from "./layout/DashboardLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GroceryList from "./pages/GroceryList";
import AddItem from "./pages/AddItem";
import Notifications from "./pages/Notifications";
import Reminders from "./pages/Reminders";
import Recipes from "./pages/Recipes";
import EcoInsights from "./pages/EcoInsights";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword";

// Protected Route
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
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />
        }
      />

      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        }
      />

      <Route
        path="/forgot-password"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPassword />
        }
      />

      <Route
        path="/reset-password/:token"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <ResetPassword />
        }
      />

      {/* Protected Dashboard */}
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
        path="/reminders"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Reminders />
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

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;