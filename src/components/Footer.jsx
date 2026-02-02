import React from "react";
import { Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h3 className="text-3xl font-light tracking-[0.25em] mb-6">DANGLY DREAMS</h3>
              <p className="text-gray-300 leading-relaxed max-w-md">
                Handcrafted jewelry from our Instagram shop{' '}
                <a href="https://www.instagram.com/dangly_dreams/" target="_blank" rel="noreferrer" className="text-amber-400 hover:text-amber-300 underline">
                  @dangly_dreams
                </a>
                , made to add sparkle to your everyday moments.
              </p>
            </div>
          </div>

          {/* Quick Links - only link to existing routes */}
          <div>
            <h4 className="text-lg font-medium mb-6 tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/collections" className="text-gray-300 hover:text-amber-400 transition-colors">Collections</a></li>
              <li><a href="/category/bridal" className="text-gray-300 hover:text-amber-400 transition-colors">Bridal Collection</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-amber-400 transition-colors">Custom Jewelry</a></li>
              <li><a href="/collections" className="text-gray-300 hover:text-amber-400 transition-colors">Care Guide</a></li>
              <li><a href="/collections" className="text-gray-300 hover:text-amber-400 transition-colors">Size Guide</a></li>
              <li><a href="/collections" className="text-gray-300 hover:text-amber-400 transition-colors">Gift Cards</a></li>
            </ul>
          </div>

          {/* Customer Care - route unknown pages to Contact */}
          <div>
            <h4 className="text-lg font-medium mb-6 tracking-wide">Customer Care</h4>
            <ul className="space-y-3 mb-6">
              <li><a href="/contact" className="text-gray-300 hover:text-amber-400 transition-colors">Contact Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-amber-400 transition-colors">Shipping Info</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-amber-400 transition-colors">Returns & Exchanges</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-amber-400 transition-colors">Warranty</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-amber-400 transition-colors">FAQ</a></li>
            </ul>

            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3" />
                <span>DM us on Instagram</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3" />
                <a
                  href="https://www.instagram.com/dangly_dreams/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  instagram.com/dangly_dreams
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 Dangly Dreams. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="/contact" className="text-gray-400 hover:text-amber-400 transition-colors">Privacy Policy</a>
              <a href="/contact" className="text-gray-400 hover:text-amber-400 transition-colors">Terms of Service</a>
              <a href="/contact" className="text-gray-400 hover:text-amber-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;