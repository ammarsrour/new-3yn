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
    <div className="max-w-2xl mx-auto text-center py-8 sm:py-12 px-4 sm:px-0">
      {/* Coming Soon Badge */}
      <div className="inline-flex items-center space-x-1.5 bg-navy-100 text-navy-700 px-3 py-1 text-sm font-medium mb-4 sm:mb-6">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse motion-reduce:animate-none" aria-hidden="true" />
        <span>Coming Soon</span>
      </div>

      {/* Hero */}
      <h1 className="text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight mb-2 sm:mb-3">
        Billboard Simulation
      </h1>
      <p className="text-base sm:text-lg text-secondary mb-6 sm:mb-8">
        See your design on actual Muscat billboards before you commit
      </p>

      {/* Illustration Placeholder - simplified on mobile */}
      <div className="bg-gradient-to-br from-navy-50 to-surface-100 border border-surface-200 p-6 sm:p-12 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
          {/* Stylized billboard mockup */}
          <div className="relative">
            <div className="w-32 sm:w-48 h-20 sm:h-28 bg-navy-200 border-4 border-navy-300 flex items-center justify-center">
              <div className="text-navy-400 text-xs">Your Creative</div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3 sm:w-4 h-6 sm:h-8 bg-navy-300" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-2 bg-navy-400" />
          </div>

          {/* Road perspective lines - hidden on mobile */}
          <div className="hidden sm:block text-navy-300" aria-hidden="true">
            <svg width="80" height="60" viewBox="0 0 80 60">
              <path d="M0 30 L80 10 M0 30 L80 50 M0 30 L80 30" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* Car icon */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-navy-200 rounded-full flex items-center justify-center">
            <Car className="w-5 h-5 sm:w-6 sm:h-6 text-navy-500" />
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-secondary text-sm sm:text-base mb-6 sm:mb-8 max-w-lg mx-auto">
        Preview your creative on real Muscat billboard locations at different times and viewing distances.
      </p>

      {/* Feature Bullets */}
      <ul className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12" aria-label="Features">
        <li className="flex items-center space-x-2 text-sm">
          <div className="w-8 h-8 bg-surface-100 flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <MapPin className="w-4 h-4 text-navy-600" />
          </div>
          <span className="text-navy-700">Real billboard locations</span>
        </li>

        <li className="flex items-center space-x-2 text-sm">
          <div className="w-8 h-8 bg-surface-100 flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <Sun className="w-4 h-4 text-navy-600" />
          </div>
          <span className="text-navy-700">Time-of-day simulation</span>
        </li>

        <li className="flex items-center space-x-2 text-sm">
          <div className="w-8 h-8 bg-surface-100 flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <Eye className="w-4 h-4 text-navy-600" />
          </div>
          <span className="text-navy-700">Drive-by perspective</span>
        </li>
      </ul>

      {/* Notify Form */}
      <div className="bg-white border border-surface-200 p-4 sm:p-6 max-w-md mx-auto">
        {submitted ? (
          <div className="flex items-center justify-center space-x-2 text-navy-700" role="status" aria-live="polite">
            <div className="w-8 h-8 bg-emerald-100 flex items-center justify-center" aria-hidden="true">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="font-medium">We'll notify you when this launches!</span>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Bell className="w-4 h-4 text-navy-600" aria-hidden="true" />
              <span className="font-medium text-navy-950" id="notify-form-label">Notify me when this launches</span>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2" aria-labelledby="notify-form-label">
              <label htmlFor="notify-email" className="sr-only">Email address</label>
              <input
                id="notify-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 border border-surface-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent min-h-[44px]"
                required
                autoComplete="email"
                aria-describedby="email-hint"
              />
              <span id="email-hint" className="sr-only">Enter your email to be notified when billboard simulation launches</span>
              <button
                type="submit"
                className="bg-navy-950 text-white px-4 py-2 text-sm font-medium hover:bg-navy-800 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 min-h-[44px]"
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
