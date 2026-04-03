import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import Navbar from "../layout/Navbar";

const VerifyEmailNotice = () => {
  return (
    <div className="min-h-screen bg-brand flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-primary/20 glass glass-strong backdrop-blur-xl border border-border rounded-2xl p-8 shadow-xl text-center">

          <Mail className="mx-auto mb-4 text-primary" size={40} />

          <h1 className="text-3xl font-bold text-primary mb-2">
            Verify Your Email
          </h1>

          <p className="text-muted-foreground mb-6">
            We’ve sent a verification link to your email.
            <br />
            Please check your inbox and click the link to activate your account.
          </p>

          <div className="text-sm text-muted-foreground">
            Didn’t receive the email?{" "}
            <Link
              to="/send-verification"
              className="text-primary font-semibold hover:underline"
            >
              Resend Email
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VerifyEmailNotice;