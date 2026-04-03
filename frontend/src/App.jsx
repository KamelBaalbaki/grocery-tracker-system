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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Email Verification Pages
import VerifyEmail from "./pages/VerifyEmail";
import VerifyYourEmail from "./pages/VerifyEmailNotice";
import SendVerification from "./pages/SendEmailVerification";


// 🔐 Protected Route (AUTH + VERIFIED)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isEmailVerified, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Logged in but NOT verified
  if (!isEmailVerified) {
    return <Navigate to="/verify-your-email" replace />;
  }

  // Fully authenticated
  return children;
};


// Public Route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isEmailVerified } = useAuth();

  if (isAuthenticated) {
    return isEmailVerified
      ? <Navigate to="/dashboard" replace />
      : <Navigate to="/verify-email-notice" replace />;
  }

  return children;
};


function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />

      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

      <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />


      {/* Email Verification Routes */}
      <Route path="/verify-email-notice" element={<VerifyYourEmail />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/send-verification" element={<SendVerification />} />


      {/* Protected Dashboard Routes */}
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


      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;