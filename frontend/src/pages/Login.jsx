import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, AlertCircle } from "lucide-react";
import Navbar from "../layout/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-primary/20 glass glass-strong backdrop-blur-xl border border-border rounded-2xl p-8 shadow-xl">
          {/* Title */}
          <h1 className="text-3xl font-bold text-primary text-center mb-2">
            Welcome Back
          </h1>

          <p className="text-muted-foreground text-center mb-8">
            Sign in to continue tracking your groceries
          </p>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-400/30 rounded-lg p-3 mb-6 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white/40 backdrop-blur text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
                />

                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white/40 backdrop-blur text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 btn rounded-xl background-gradient text-white font-semibold hover:bg-foreground/90 transition duration-300"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <>Sign In</>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-sm text-muted-foreground flex flex-col gap-2 items-center">
            <div>
              Forgot your password?{" "}
              <Link
                to="/forgot-password"
                className="text-primary font-semibold hover:underline"
              >
                Click here
              </Link>
            </div>
            <div>
              Verify your email!{" "}
              <Link
                to="/send-verification"
                className="text-primary font-semibold hover:underline"
              >
                Click here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
