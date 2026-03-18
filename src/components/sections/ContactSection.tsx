import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-32 bg-surface-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left - CTA */}
          <div>
            <p className="text-label text-emerald-600 mb-4">
              Contact
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-950 tracking-tight leading-tight mb-6">
              Ready to optimize your billboards?
            </h2>
            <p className="text-lead mb-10 max-w-none">
              Get in touch for enterprise solutions, custom integrations, or any questions about our platform.
            </p>

            {/* Primary contact */}
            <a
              href="mailto:contact@3yn.ai"
              className="group inline-flex items-center space-x-4 mb-12"
            >
              <span className="w-16 h-16 bg-success-500 flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </span>
              <span>
                <span className="block text-secondary">Email us</span>
                <span className="block text-xl font-bold text-navy-950 group-hover:text-success-600 transition-colors">contact@3yn.ai</span>
              </span>
            </a>

            {/* Response time */}
            <p className="text-secondary">
              Typical response time: <span className="font-semibold text-success-600">within 24 hours</span>
            </p>
          </div>

          {/* Right - Quick links */}
          <div className="bg-white p-10 lg:p-12 border-l-4 border-navy-950">
            <h3 className="text-xl font-bold text-navy-950 mb-8 tracking-tight">Quick Links</h3>

            <div className="space-y-0">
              <a
                href="mailto:contact@3yn.ai?subject=General Inquiry"
                className="group flex items-center justify-between py-6 border-b border-surface-200 hover:border-success-300 transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-navy-950 mb-1">General Inquiries</h4>
                  <p className="text-secondary">Questions about our services</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-success-600 group-hover:translate-x-1 transition-all" />
              </a>

              <a
                href="mailto:contact@3yn.ai?subject=Support Request"
                className="group flex items-center justify-between py-6 border-b border-surface-200 hover:border-info-300 transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-navy-950 mb-1">Technical Support</h4>
                  <p className="text-secondary">Help with your account or analysis</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-info-600 group-hover:translate-x-1 transition-all" />
              </a>

              <a
                href="mailto:contact@3yn.ai?subject=Partnership Inquiry"
                className="group flex items-center justify-between py-6 border-b border-surface-200 hover:border-warning-300 transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-navy-950 mb-1">Partnerships</h4>
                  <p className="text-secondary">Explore collaboration opportunities</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-warning-600 group-hover:translate-x-1 transition-all" />
              </a>

              <a
                href="mailto:contact@3yn.ai?subject=Enterprise Demo Request"
                className="group flex items-center justify-between py-6 hover:border-gold-400 transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-navy-950 mb-1">Enterprise Demo</h4>
                  <p className="text-secondary">See 3YN in action for your team</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-gold-600 group-hover:translate-x-1 transition-all" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
