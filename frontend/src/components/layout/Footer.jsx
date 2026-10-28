import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Mail } from 'lucide-react';
import { Logo } from '../common/Logo';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-warm-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="inline-flex items-center">
              <Logo size="md" showText={true} showTagline={true} />
            </Link>
            <p className="text-xs text-charcoal-muted max-w-sm leading-relaxed mt-2">
              Roomora connects students searching for accommodation with room owners who want to list and manage their rooms. Transparent listings, real-time availability, and protected contact exchange.
            </p>
            <div className="flex items-center gap-2 text-xs text-charcoal-muted pt-1">
              <ShieldCheck className="w-4 h-4 text-forest-800 shrink-0" />
              <span>Direct owner contact disclosed strictly upon accepted booking.</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-muted">
              <li>
                <Link to="/rooms" className="hover:text-forest-800 transition-colors">
                  Find Rooms
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-forest-800 transition-colors">
                  About Roomora
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-forest-800 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-forest-800 transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/owner/rooms/new" className="hover:text-forest-800 transition-colors">
                  List Your Room
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">
              Legal &amp; Policy
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-muted">
              <li>
                <Link to="/terms" className="hover:text-forest-800 transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-forest-800 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li className="pt-2 text-[11px] text-charcoal-muted leading-relaxed">
                Student Accommodation Discovery
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-warm-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-muted">
          <p>
            &copy; {new Date().getFullYear()} Roomora. All rights reserved.
          </p>
          <p>
            Find a place that feels like yours.
          </p>
        </div>
      </div>
    </footer>
  );
};
