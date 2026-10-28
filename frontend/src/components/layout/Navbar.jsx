import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, PlusCircle, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { Logo } from '../common/Logo';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';

export const Navbar = () => {
  const { user, isAuthenticated, isStudent, isOwner, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors py-1 ${
      isActive
        ? 'text-teal-600 font-semibold border-b-2 border-teal-600'
        : 'text-charcoal-muted hover:text-navy-800'
    }`;

  const mobileNavLinkClasses = ({ isActive }) =>
    `block px-3 py-2 text-base font-medium rounded-md ${
      isActive
        ? 'bg-navy-50 text-teal-600 font-semibold'
        : 'text-charcoal hover:bg-surface-hover'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="inline-flex items-center focus:outline-none">
            <Logo size="md" showText={true} showTagline={true} />
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/rooms" className={navLinkClasses}>
              Discover Rooms
            </NavLink>

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

            <NavLink to="/about" className={navLinkClasses}>
              About
            </NavLink>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isOwner && (
                  <Link to="/owner/rooms/new">
                    <Button variant="primary" size="sm" icon={PlusCircle}>
                      Post a Room
                    </Button>
                  </Link>
                )}

                <div className="h-6 w-px bg-surface-border" />

                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm font-medium text-charcoal hover:text-navy-800 py-1 px-2 rounded-md hover:bg-surface-hover transition-colors"
                >
                  <Avatar src={user?.profile_photo} name={user?.full_name} size="sm" />
                  <span className="max-w-[130px] truncate">{user?.full_name}</span>
                  <Badge variant={user?.role === 'owner' ? 'owner' : 'student'} size="sm">
                    {user?.role === 'owner' ? 'Owner' : 'Student'}
                  </Badge>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-1.5 text-charcoal-muted hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
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
                  className="text-sm font-medium text-charcoal hover:text-navy-800 px-3 py-1.5 transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Create Account
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <Link to="/profile" className="p-1">
                <Avatar src={user?.profile_photo} name={user?.full_name} size="sm" />
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-charcoal-muted hover:text-charcoal hover:bg-surface-hover rounded-md"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-border bg-white px-4 pt-3 pb-6 space-y-3">
          <NavLink
            to="/rooms"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClasses}
          >
            Discover Rooms
          </NavLink>

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
              <NavLink
                to="/owner/rooms/new"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClasses}
              >
                + Post a Room
              </NavLink>
            </>
          )}

          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClasses}
          >
            About
          </NavLink>

          <div className="pt-3 border-t border-surface-border">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-charcoal hover:bg-surface-hover rounded-md"
                >
                  <User className="w-4 h-4 text-teal-600" />
                  <span>My Profile ({user?.role})</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-md"
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
                  className="w-full py-2 text-center text-sm font-medium text-charcoal border border-surface-border rounded-md hover:bg-surface-hover"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 shadow-subtle"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
