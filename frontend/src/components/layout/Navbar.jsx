import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Plus, User, ArrowRight, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { Logo } from '../common/Logo';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';

export const Navbar = () => {
  const { user, isAuthenticated, isStudent, isOwner, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-semibold transition-colors py-1 ${
      isActive
        ? 'text-forest-800 border-b-2 border-forest-800'
        : 'text-charcoal-muted hover:text-charcoal'
    }`;

  const mobileNavLinkClasses = ({ isActive }) =>
    `block px-3 py-2 text-base font-semibold rounded-md ${
      isActive
        ? 'bg-sage text-forest-800'
        : 'text-charcoal hover:bg-warm-hover'
    }`;

  const handleHowItWorksClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('how-it-works');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-warm-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Wordmark */}
          <Link to="/" className="inline-flex items-center focus:outline-none">
            <Logo size="md" showText={true} showTagline={false} />
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/rooms" className={navLinkClasses}>
              Find Rooms
            </NavLink>

            <a
              href="/#how-it-works"
              onClick={handleHowItWorksClick}
              className="text-sm font-semibold text-charcoal-muted hover:text-charcoal transition-colors py-1"
            >
              How It Works
            </a>

            {isAuthenticated && isStudent && (
              <NavLink to="/student/bookings" className={navLinkClasses}>
                My Requests
              </NavLink>
            )}

            {isAuthenticated && isOwner && (
              <>
                <NavLink to="/owner/rooms" className={navLinkClasses}>
                  My Listings
                </NavLink>
                <NavLink to="/owner/bookings" className={navLinkClasses}>
                  Booking Requests
                </NavLink>
                <NavLink to="/owner/dashboard" className={navLinkClasses}>
                  Dashboard
                </NavLink>
              </>
            )}

            <Link
              to={isAuthenticated && isOwner ? '/owner/rooms/new' : '/register'}
              className="text-sm font-semibold text-charcoal-muted hover:text-forest-800 transition-colors py-1"
            >
              List Your Room
            </Link>
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isOwner && (
                  <Link to="/owner/rooms/new">
                    <Button variant="secondary" size="sm" icon={Plus}>
                      Post Room
                    </Button>
                  </Link>
                )}

                <div className="h-5 w-px bg-warm-border" />

                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm font-semibold text-charcoal hover:text-forest-800 py-1 px-2 rounded-md hover:bg-warm-hover transition-colors"
                >
                  <Avatar src={user?.profile_photo} name={user?.full_name} size="sm" />
                  <span className="max-w-[120px] truncate">{user?.full_name}</span>
                  <Badge variant={user?.role === 'owner' ? 'owner' : 'student'} size="sm">
                    {user?.role === 'owner' ? 'Owner' : 'Student'}
                  </Badge>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-1.5 text-charcoal-muted hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-charcoal hover:text-forest-800 px-3 py-1.5 transition-colors"
                >
                  Login
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <Link to="/profile" className="p-1">
                <Avatar src={user?.profile_photo} name={user?.full_name} size="sm" />
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-charcoal-muted hover:text-charcoal hover:bg-warm-hover rounded-md"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-warm-border bg-white px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          <NavLink
            to="/rooms"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClasses}
          >
            Find Rooms
          </NavLink>

          <a
            href="/#how-it-works"
            onClick={(e) => {
              handleHowItWorksClick(e);
              setMobileMenuOpen(false);
            }}
            className="block px-3 py-2 text-base font-semibold text-charcoal hover:bg-warm-hover rounded-md"
          >
            How It Works
          </a>

          <Link
            to={isAuthenticated && isOwner ? '/owner/rooms/new' : '/register'}
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-charcoal hover:bg-warm-hover rounded-md"
          >
            List Your Room
          </Link>

          {isAuthenticated && isStudent && (
            <NavLink
              to="/student/bookings"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClasses}
            >
              My Requests
            </NavLink>
          )}

          {isAuthenticated && isOwner && (
            <>
              <NavLink
                to="/owner/rooms"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClasses}
              >
                My Listings
              </NavLink>
              <NavLink
                to="/owner/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClasses}
              >
                Booking Requests
              </NavLink>
              <NavLink
                to="/owner/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClasses}
              >
                Dashboard
              </NavLink>
            </>
          )}

          <div className="pt-3 border-t border-warm-border">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-charcoal hover:bg-warm-hover rounded-md"
                >
                  <User className="w-4 h-4 text-forest-800" />
                  <span>My Profile ({user?.role === 'owner' ? 'Owner' : 'Student'})</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 rounded-md"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-sm font-semibold text-charcoal border border-warm-border rounded-md hover:bg-warm-hover"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-sm font-semibold text-white bg-forest-800 rounded-md hover:bg-forest-900 shadow-subtle"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
