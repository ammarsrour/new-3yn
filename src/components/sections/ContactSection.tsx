import React from 'react';
import { Mail, MessageCircle, Send } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? Need support? We're here to help!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-12 text-white">
                <div className="mb-8">
                  <MessageCircle className="w-16 h-16 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Let's Talk</h3>
                  <p className="text-blue-100">
                    We'd love to hear from you. Reach out to us for any inquiries, support, or feedback.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Email Us</h4>
                      <a
                        href="mailto:contact@3yn.ai"
                        className="text-blue-100 hover:text-white transition-colors"
                      >
                        contact@3yn.ai
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Send className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Response Time</h4>
                      <p className="text-blue-100">
                        We typically respond within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">General Inquiries</h4>
                    <p className="text-gray-600 mb-2">
                      For general questions about our services and features
                    </p>
                    <a
                      href="mailto:contact@3yn.ai"
                      className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center space-x-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>contact@3yn.ai</span>
                    </a>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Support</h4>
                    <p className="text-gray-600 mb-2">
                      Need help with your account or analysis?
                    </p>
                    <a
                      href="mailto:contact@3yn.ai?subject=Support Request"
                      className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center space-x-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>contact@3yn.ai</span>
                    </a>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Partnership</h4>
                    <p className="text-gray-600 mb-2">
                      Interested in partnering with us?
                    </p>
                    <a
                      href="mailto:contact@3yn.ai?subject=Partnership Inquiry"
                      className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center space-x-2"
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
