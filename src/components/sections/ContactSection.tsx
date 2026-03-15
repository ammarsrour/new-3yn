import React from 'react';
import { Mail, MessageCircle, Send } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="relative py-24 bg-gray-900 overflow-hidden">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Have questions? Need support? We're here to help!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Left side - emerald accent panel */}
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 p-12 text-white">
                <div className="mb-8">
                  <MessageCircle className="w-16 h-16 mb-4 text-emerald-100" />
                  <h3 className="text-2xl font-bold mb-2">Let's Talk</h3>
                  <p className="text-emerald-100">
                    We'd love to hear from you. Reach out to us for any inquiries, support, or feedback.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 flex-shrink-0 mt-1 text-emerald-100" />
                    <div>
                      <h4 className="font-semibold mb-1">Email Us</h4>
                      <a
                        href="mailto:contact@3yn.ai"
                        className="text-emerald-100 hover:text-white transition-colors"
                      >
                        contact@3yn.ai
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Send className="w-6 h-6 flex-shrink-0 mt-1 text-emerald-100" />
                    <div>
                      <h4 className="font-semibold mb-1">Response Time</h4>
                      <p className="text-emerald-100">
                        We typically respond within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - contact info */}
              <div className="p-12 bg-gray-800/30">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">General Inquiries</h4>
                    <p className="text-gray-400 mb-2">
                      For general questions about our services and features
                    </p>
                    <a
                      href="mailto:contact@3yn.ai"
                      className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center space-x-2 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>contact@3yn.ai</span>
                    </a>
                  </div>

                  <div className="pt-6 border-t border-gray-700">
                    <h4 className="font-semibold text-white mb-2">Support</h4>
                    <p className="text-gray-400 mb-2">
                      Need help with your account or analysis?
                    </p>
                    <a
                      href="mailto:contact@3yn.ai?subject=Support Request"
                      className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center space-x-2 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>contact@3yn.ai</span>
                    </a>
                  </div>

                  <div className="pt-6 border-t border-gray-700">
                    <h4 className="font-semibold text-white mb-2">Partnership</h4>
                    <p className="text-gray-400 mb-2">
                      Interested in partnering with us?
                    </p>
                    <a
                      href="mailto:contact@3yn.ai?subject=Partnership Inquiry"
                      className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center space-x-2 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>contact@3yn.ai</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
