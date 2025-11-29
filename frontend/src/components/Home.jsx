import React from 'react';
import { ChevronRight, Zap, Target, Leaf } from 'lucide-react';

// You can replace this with a high-quality, free-to-use food image from sites like Unsplash or Pexels.
const heroImageUrl = 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1887&auto=format&fit=crop';

const FeatureCard = ({ icon, title, description }) => {
  const Icon = icon;
  return (
    <div className="bg-white p-6 rounded-2xl shadow-soft text-center">
      <div className="bg-primary-lightest inline-block p-3 rounded-full mb-4">
        <Icon className="text-primary-dark" size={24} />
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-neutral-500 text-sm">{description}</p>
    </div>
  );
};

function Home({ onNavigate }) {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="text-center lg:text-left">
          <span className="font-semibold text-primary-dark">Welcome to MessMate</span>
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mt-2">
            Transforming Your Mess Experience
          </h1>
          <p className="mt-4 text-lg text-neutral-500">
            Say goodbye to guesswork. With MessMate, you get daily menus, live feedback, and nutritional insights, all in one place.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="mt-8 inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-full hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Go to Dashboard <ChevronRight size={20} />
          </button>
        </div>
        <div
          className="h-80 lg:h-full w-full bg-cover bg-center rounded-2xl shadow-soft-lg"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
        />
      </div>

      {/* Features Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Why Choose MessMate?</h2>
        <p className="max-w-2xl mx-auto text-neutral-500 mb-10">
          We are dedicated to improving transparency, reducing food waste, and enhancing diner satisfaction through technology.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard icon={Zap} title="Live Feedback" description="Share your thoughts instantly and see what others are saying with real-time sentiment analysis." />
          <FeatureCard icon={Leaf} title="Daily Menus" description="Check today's menu and nutritional information anytime, anywhere, right from your phone." />
          <FeatureCard icon={Target} title="Data-Driven" description="Our platform helps administration make smarter decisions to reduce waste and improve food quality." />
        </div>
      </div>
    </div>
  );
}

export default Home;
