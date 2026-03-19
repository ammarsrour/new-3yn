import React, { useState } from 'react';
import { Eye, Sun, Car, MapPin, Bell, Check } from 'lucide-react';

const SimulatePage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // TODO: Send to backend when ready
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      {/* Coming Soon Badge */}
      <div className="inline-flex items-center space-x-1.5 bg-navy-100 text-navy-700 px-3 py-1 text-sm font-medium mb-6">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span>Coming Soon</span>
      </div>

      {/* Hero */}
      <h1 className="text-3xl font-bold text-navy-950 tracking-tight mb-3">
        Billboard Simulation
      </h1>
      <p className="text-lg text-secondary mb-8">
        See your design on actual Muscat billboards before you commit
      </p>

      {/* Illustration Placeholder */}
      <div className="bg-gradient-to-br from-navy-50 to-surface-100 border border-surface-200 p-12 mb-8">
        <div className="flex justify-center items-center space-x-8">
          {/* Stylized billboard mockup */}
          <div className="relative">
            <div className="w-48 h-28 bg-navy-200 border-4 border-navy-300 flex items-center justify-center">
              <div className="text-navy-400 text-xs">Your Creative Here</div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-8 bg-navy-300" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-2 bg-navy-400" />
          </div>

          {/* Road perspective lines */}
          <div className="text-navy-300">
            <svg width="80" height="60" viewBox="0 0 80 60">
              <path d="M0 30 L80 10 M0 30 L80 50 M0 30 L80 30" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* Car icon */}
          <div className="w-12 h-12 bg-navy-200 rounded-full flex items-center justify-center">
            <Car className="w-6 h-6 text-navy-500" />
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-secondary mb-8 max-w-lg mx-auto">
        Upload your creative and preview how it looks on real billboard locations
        across Muscat — at different times of day, weather conditions, and viewing distances.
      </p>

      {/* Feature Bullets */}
      <div className="flex justify-center space-x-8 mb-12">
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-8 h-8 bg-surface-100 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-navy-600" />
          </div>
          <span className="text-navy-700">Real billboard locations</span>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <div className="w-8 h-8 bg-surface-100 flex items-center justify-center">
            <Sun className="w-4 h-4 text-navy-600" />
          </div>
          <span className="text-navy-700">Time-of-day simulation</span>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <div className="w-8 h-8 bg-surface-100 flex items-center justify-center">
            <Eye className="w-4 h-4 text-navy-600" />
          </div>
          <span className="text-navy-700">Drive-by perspective</span>
        </div>
      </div>

      {/* Notify Form */}
      <div className="bg-white border border-surface-200 p-6 max-w-md mx-auto">
        {submitted ? (
          <div className="flex items-center justify-center space-x-2 text-navy-700">
            <div className="w-8 h-8 bg-emerald-100 flex items-center justify-center">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="font-medium">We'll notify you when this launches!</span>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Bell className="w-4 h-4 text-navy-600" />
              <span className="font-medium text-navy-950">Notify me when this launches</span>
            </div>
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 border border-surface-300 text-sm focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-navy-950 text-white px-4 py-2 text-sm font-medium hover:bg-navy-800 transition-colors"
              >
                Notify Me
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SimulatePage;
