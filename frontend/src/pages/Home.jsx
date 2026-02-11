import { Link } from 'react-router-dom';
import { Leaf, ShoppingCart, CheckCircle, Heart, Clock, Sparkles } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';

const Home = () => {
  const features = [
    { icon: ShoppingCart, title: 'Track Groceries', desc: 'Monitor all your items' },
    { icon: CheckCircle, title: 'Reduce Waste', desc: 'Never let food expire' },
    { icon: Heart, title: 'Get Recipes', desc: 'Use what you have' },
    { icon: Clock, title: 'Eco Insights', desc: 'See your impact' },
  ];

  return (
    <div className="landing-page">
      <Navbar />
      
      <section className="hero">
        <div className="hero-badge">
          <Sparkles size={16} />
          <span>New</span> — Smart expiry tracking is here
        </div>
        
        <div className="hero-logo">
          <Leaf size={80} strokeWidth={1.5} />
        </div>
        
        <h1 className="hero-title">Smart Grocery Tracker</h1>
        <p className="hero-subtitle">
          Reduce food waste, track your groceries, and save money with intelligent expiry management.
        </p>
        
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started Free
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Sign In
          </Link>
        </div>

        <div className="features">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="feature-icon">
                <feature.icon size={24} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
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
