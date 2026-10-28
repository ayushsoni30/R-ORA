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

      setLoggedInUser(res.user);
      setShowSuccessPopup(true);

      setTimeout(() => {
        const target = location.state?.from || (res.user.role === 'owner' ? '/owner/dashboard' : '/rooms');
        navigate(target, { replace: true });
      }, 2000);
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
      <div className="max-w-md w-full bg-white border border-warm-border rounded-xl p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center mb-2">
            <Logo size="md" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal tracking-tight">
            Sign In to Roomora
          </h1>
          <p className="text-xs text-charcoal-muted">
            Access room listings, manage booking requests, and communicate directly with room owners.
          </p>
        </div>

        {errors.general && (
          <div className="bg-rose-50 border border-rose-200 rounded-md p-3 flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errors.general}</span>
          </div>
        )}

        {rateLimitTimer > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-center gap-2 text-xs text-amber-900">
            <Clock className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Rate limit protection active. Please retry in <strong>{rateLimitTimer}s</strong>.</span>
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

        <div className="text-center pt-2 border-t border-warm-border text-xs text-charcoal-muted">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="font-bold text-forest-800 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>

      {/* Success Notification Modal */}
      {showSuccessPopup && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-white rounded-xl border border-warm-border shadow-elevated w-full max-w-sm p-6 text-center space-y-5 animate-scaleUp overflow-hidden relative">
            <div className="w-12 h-12 rounded-full bg-sage text-forest-800 flex items-center justify-center mx-auto shadow-subtle border border-sage-300">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-forest-800 bg-sage px-2.5 py-0.5 rounded border border-sage-300">
                Authenticated
              </span>
              <h2 className="text-lg font-bold text-charcoal pt-2">
                Welcome back, {loggedInUser?.full_name}!
              </h2>
              <p className="text-xs text-charcoal-muted">
                Signed in as {loggedInUser?.role === 'owner' ? 'Property Owner' : 'Student Seeker'}
              </p>
            </div>

            <div className="bg-warm-bg p-3.5 rounded-lg border border-warm-border flex items-center gap-3 text-left">
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

            <div className="space-y-2 pt-1">
              <div className="w-full bg-warm-muted h-1 rounded-full overflow-hidden">
                <div className="h-full bg-forest-800 animate-progressBar" />
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
