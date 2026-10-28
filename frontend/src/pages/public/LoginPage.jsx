import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, AlertCircle, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../services/api';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const { error } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitTimer, setRateLimitTimer] = useState(0);

  // Success Popup State
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated && !showSuccessPopup) {
      navigate(user?.role === 'owner' ? '/owner/dashboard' : '/rooms', { replace: true });
    }
  }, [isAuthenticated, user, navigate, showSuccessPopup]);

  useEffect(() => {
    let interval = null;
    if (rateLimitTimer > 0) {
      interval = setInterval(() => {
        setRateLimitTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [rateLimitTimer]);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = () => {
    const role = loggedInUser?.role || user?.role;
    const target = location.state?.from || (role === 'owner' ? '/owner/dashboard' : '/rooms');
    navigate(target, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (rateLimitTimer > 0) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      // Show smooth professional success popup
      setLoggedInUser(res.user);
      setShowSuccessPopup(true);

      // Auto redirect after 2 seconds
      setTimeout(() => {
        const target = location.state?.from || (res.user.role === 'owner' ? '/owner/dashboard' : '/rooms');
        navigate(target, { replace: true });
      }, 2200);
    } catch (err) {
      if (err.response?.status === 429) {
        setRateLimitTimer(60);
        error('Too many sign-in attempts. Please wait 60 seconds before trying again.');
      } else {
        const msg = getErrorMessage(err);
        setErrors({ general: msg });
        error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-md w-full bg-white border border-surface-border rounded-lg p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center mb-2">
            <Logo size="md" />
          </Link>
          <h1 className="text-xl font-bold text-navy tracking-tight">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-charcoal-muted">
            Access room listings, manage booking requests, and communicate securely.
          </p>
        </div>

        {errors.general && (
          <div className="bg-rose-50 border border-rose-200 rounded-md p-3 flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errors.general}</span>
          </div>
        )}

        {rateLimitTimer > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-center gap-2 text-xs text-amber-800">
            <Clock className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Rate limit protection active. Retry in <strong>{rateLimitTimer}s</strong>.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            placeholder="student@example.com or owner@example.com"
          />

          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            placeholder="Minimum 8 characters"
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            disabled={rateLimitTimer > 0}
            icon={LogIn}
            className="w-full mt-2"
          >
            {rateLimitTimer > 0 ? `Wait ${rateLimitTimer}s` : 'Sign In'}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-surface-border text-xs text-charcoal-muted">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-700">
            Create an Account
          </Link>
        </div>
      </div>

      {/* Smooth Professional Login Success Popup */}
      {showSuccessPopup && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-white rounded-xl border border-surface-border shadow-2xl w-full max-w-sm p-6 text-center space-y-5 animate-scaleUp overflow-hidden relative">
            {/* Top decorative accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-navy-700 via-teal-600 to-teal-500" />

            <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                Session Authenticated
              </span>
              <h2 className="text-lg font-bold text-navy pt-2">
                Successfully Logged In as {loggedInUser?.role === 'owner' ? 'Property Owner' : 'Student'}
              </h2>
              <p className="text-xs text-charcoal-muted">
                Welcome back, {loggedInUser?.full_name}!
              </p>
            </div>

            {/* User Profile Card Snippet */}
            <div className="bg-surface-bg p-3.5 rounded-lg border border-surface-border flex items-center gap-3 text-left">
              <Avatar src={loggedInUser?.profile_photo} name={loggedInUser?.full_name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-charcoal truncate">
                  {loggedInUser?.full_name}
                </p>
                <p className="text-[11px] text-charcoal-muted truncate">
                  {loggedInUser?.email}
                </p>
              </div>
              <Badge variant={loggedInUser?.role === 'owner' ? 'owner' : 'student'} size="sm">
                {loggedInUser?.role === 'owner' ? 'Owner' : 'Student'}
              </Badge>
            </div>

            {/* Auto-redirect indicator */}
            <div className="space-y-2 pt-1">
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600 animate-progressBar" />
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={handleProceed}
                icon={ArrowRight}
                className="w-full"
              >
                {loggedInUser?.role === 'owner' ? 'Go to Owner Dashboard' : 'Start Discovering Rooms'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
