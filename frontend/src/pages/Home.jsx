import { Link } from "react-router-dom";
import { Leaf, ShoppingCart, CheckCircle, Heart, Clock, Sparkles } from "lucide-react";
import Navbar from "../layout/Navbar";

const Home = () => {
  const features = [
    { icon: ShoppingCart, title: "Track Groceries", desc: "Monitor all your items" },
    { icon: CheckCircle, title: "Reduce Waste", desc: "Never let food expire" },
    { icon: Heart, title: "Get Recipes", desc: "Use what you have" },
    { icon: Clock, title: "Eco Insights", desc: "See your impact" },
  ];

  return (
    <div className="min-h-screen bg-brand flex flex-col">
      <Navbar />

      <section className="flex flex-1 flex-col items-center justify-center text-center px-8 py-16 relative">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white/20 backdrop-blur text-sm text-muted-foreground mb-8">
          <Sparkles size={16} />
          <span className="font-semibold text-primary">New</span> — Smart expiry tracking is here
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <Leaf
            size={80}
            strokeWidth={1.5}
            className="text-primary animate-[float_3s_ease-in-out_infinite] drop-shadow-[0_0_30px_rgba(22,163,74,0.5)]"
          />
        </div>

        {/* Title */}
        <h1 className="text-5xl font-extrabold mb-4 text-gradient leading-normal">
          Smart Grocery Tracker
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-muted-foreground mb-10 max-w-lg">
          Reduce food waste, track your groceries, and save money with intelligent expiry management.
        </p>

        {/* Actions */}
        <div className="flex gap-4 mb-16">
          <Link
            to="/register"
            className="px-6 py-3 btn rounded-xl background-gradient border border-transparent text-white font-semibold hover:bg-foreground/90 hover:border-foreground duration-500 transition"
          >
            Get Started Free
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 rounded-xl border border-border text-primary bg-white/20 backdrop-blur font-semibold hover:border-foreground duration-500 hover:text-foreground transition"
          >
            Sign In
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/20 backdrop-blur-xl border border-border rounded-2xl p-6 text-center transition hover:-translate-y-2 duration-500 hover:shadow-[0_0_25px_rgba(22,163,74,0.4)]"
            >
              <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-xl background-gradient text-white">
                <feature.icon size={24} />
              </div>

              <h3 className="text-base font-semibold text-foreground">
                {feature.title}
              </h3>

              <p className="text-sm text-muted-foreground mt-2">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
};

export default Home;