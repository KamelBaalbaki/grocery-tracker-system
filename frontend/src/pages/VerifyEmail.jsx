import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "../layout/Navbar";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(3);
  const calledRef = useRef(false);

  useEffect(() => {
    if (!token || calledRef.current) return;

    calledRef.current = true;

    let interval;

    const verify = async () => {
      try {
        const res = await authAPI.verifyEmail(token);
        setMessage(res.message || "Email verified successfully");

        let counter = 3;

        interval = setInterval(() => {
          counter--;
          setCountdown(counter);

          if (counter === 0) {
            clearInterval(interval);
            navigate("/login");
          }
        }, 1000);
      } catch (err) {
        setError(err.response?.data?.message || "Verification failed");
      }
    };

    verify();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-brand flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-primary/20 glass glass-strong backdrop-blur-xl border border-border rounded-2xl p-8 shadow-xl text-center">
          {/* Success */}
          {message && (
            <>
              <CheckCircle size={40} className="mx-auto text-green-500 mb-4" />

              <h1 className="text-2xl font-bold text-green-500 mb-2">
                Email Verified
              </h1>

              <p className="text-muted-foreground">{message}</p>

              <p className="text-sm mt-4 text-muted-foreground">
                Redirecting to login in {countdown}...
              </p>
            </>
          )}

          {/* Error */}
          {error && (
            <>
              <AlertCircle size={40} className="mx-auto text-red-500 mb-4" />

              <h1 className="text-2xl font-bold text-red-500 mb-2">
                Verification Failed
              </h1>

              <p className="text-muted-foreground mb-4">{error}</p>

              <button
                onClick={() => navigate("/send-verification")}
                className="btn background-gradient text-white px-4 py-2 rounded-lg"
              >
                Resend Verification Email
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
