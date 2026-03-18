import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-32 bg-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left - CTA */}
          <div>
            <p className="text-emerald-600 font-semibold tracking-[0.15em] uppercase text-sm mb-4">
              Contact
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0f2942] tracking-tight leading-[1.1] mb-6">
              Ready to optimize your billboards?
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-10">
              Get in touch for enterprise solutions, custom integrations, or any questions about our platform.
            </p>

            {/* Primary contact */}
            <a
              href="mailto:contact@3yn.ai"
              className="group inline-flex items-center space-x-4 mb-12"
            >
              <span className="w-16 h-16 bg-[#0f2942] flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </span>
              <span>
                <span className="block text-sm text-slate-500 font-medium">Email us</span>
                <span className="block text-xl font-bold text-[#0f2942] group-hover:text-emerald-600 transition-colors">contact@3yn.ai</span>
              </span>
            </a>

            {/* Response time */}
            <p className="text-sm text-slate-500">
              Typical response time: <span className="font-semibold text-[#0f2942]">within 24 hours</span>
            </p>
          </div>

          {/* Right - Quick links */}
          <div className="bg-white p-10 lg:p-12">
            <h3 className="text-xl font-bold text-[#0f2942] mb-8">Quick Links</h3>

            <div className="space-y-0">
              <a
                href="mailto:contact@3yn.ai?subject=General Inquiry"
                className="group flex items-center justify-between py-6 border-b border-slate-200 hover:border-emerald-200 transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-[#0f2942] mb-1">General Inquiries</h4>
                  <p className="text-sm text-slate-500">Questions about our services</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </a>

              <a
                href="mailto:contact@3yn.ai?subject=Support Request"
                className="group flex items-center justify-between py-6 border-b border-slate-200 hover:border-emerald-200 transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-[#0f2942] mb-1">Technical Support</h4>
                  <p className="text-sm text-slate-500">Help with your account or analysis</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </a>

              <a
                href="mailto:contact@3yn.ai?subject=Partnership Inquiry"
                className="group flex items-center justify-between py-6 border-b border-slate-200 hover:border-emerald-200 transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-[#0f2942] mb-1">Partnerships</h4>
                  <p className="text-sm text-slate-500">Explore collaboration opportunities</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </a>

              <a
                href="mailto:contact@3yn.ai?subject=Enterprise Demo Request"
                className="group flex items-center justify-between py-6 hover:border-emerald-200 transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-[#0f2942] mb-1">Enterprise Demo</h4>
                  <p className="text-sm text-slate-500">See 3YN in action for your team</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
