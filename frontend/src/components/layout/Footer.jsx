import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Mail, Phone } from 'lucide-react';
import { Logo } from '../common/Logo';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-surface-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="inline-flex items-center">
              <Logo size="md" showText={true} showTagline={true} />
            </Link>
            <p className="text-xs text-charcoal-muted max-w-sm leading-relaxed mt-2">
              Find Your Room, Feel at Home. Roomora simplifies student room discovery by connecting verified property owners directly with university students through transparent listings and protected booking requests.
            </p>
            <div className="flex items-center gap-2 text-xs text-charcoal-muted pt-1">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Direct owner contact disclosed strictly upon accepted booking.</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-navy-800 uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-muted">
              <li>
                <Link to="/rooms" className="hover:text-teal-600 transition-colors">
                  Discover Rooms
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-600 transition-colors">
                  About Roomora
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-teal-600 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-teal-600 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/owner/rooms/new" className="hover:text-teal-600 transition-colors">
                  List Your Property
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-navy-800 uppercase tracking-wider mb-3">
              Legal &amp; Policies
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-muted">
              <li>
                <Link to="/terms" className="hover:text-teal-600 transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-teal-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <span className="text-charcoal-subtle">Student Accommodation Platform</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-muted">
          <p>
            &copy; {new Date().getFullYear()} Roomora. All rights reserved.
          </p>
          <p>
            Designed for student comfort and trusted accommodation discovery.
          </p>
        </div>
      </div>
    </footer>
  );
};
