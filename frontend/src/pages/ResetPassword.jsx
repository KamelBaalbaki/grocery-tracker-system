import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import { Lock, AlertCircle } from "lucide-react";
import Navbar from "../layout/Navbar";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(loading) return;

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await authAPI.resetPassword(token, password);

      setMessage(res.message || "Password reset successful");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
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
            Reset Password
          </h1>

          <p className="text-muted-foreground text-center mb-8">
            Enter your new password
          </p>

          {/* Success Message */}
          {message && (
            <div className="flex items-center gap-2 text-green-500 bg-green-500/10 border border-green-400/30 rounded-lg p-3 mb-6 text-sm">
              {message} — redirecting to login...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-400/30 rounded-lg p-3 mb-6 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                New Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
                />

                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                <>Reset Password</>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;