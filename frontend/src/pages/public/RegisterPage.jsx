import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, AlertCircle, Clock, Camera, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../services/api';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import { Avatar } from '../../components/common/Avatar';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'student',
    gender: '',
    age: '',
    profile_photo: '',
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitTimer, setRateLimitTimer] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'owner' ? '/owner/dashboard' : '/rooms', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    let interval = null;
    if (rateLimitTimer > 0) {
      interval = setInterval(() => {
        setRateLimitTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [rateLimitTimer]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      error('Please upload a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      error('Image size must be smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target.result;
      setPhotoPreview(dataUrl);
      setFormData((prev) => ({ ...prev, profile_photo: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must contain 10 to 15 digits (e.g. +919876543210)';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (formData.age) {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 16 || ageNum > 120) {
        newErrors.age = 'Age must be between 16 and 120';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (rateLimitTimer > 0) return;

    setIsLoading(true);
    setErrors({});

    try {
      const payload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
        gender: formData.gender || null,
        age: formData.age ? parseInt(formData.age, 10) : null,
        profile_photo: formData.profile_photo || null,
      };

      await register(payload);
      success('Account registered successfully! Please sign in with your credentials.');
      navigate('/login');
    } catch (err) {
      if (err.response?.status === 429) {
        setRateLimitTimer(60);
        error('Registration rate limit reached. Please wait 60 seconds.');
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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white border border-surface-border rounded-lg p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center mb-2">
            <Logo size="md" />
          </Link>
          <h1 className="text-xl font-bold text-navy tracking-tight">
            Create Your Roomora Account
          </h1>
          <p className="text-xs text-charcoal-muted">
            Join Roomora to discover rooms or list accommodations with protected contact access.
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
            <span>Registration limit active. Please wait <strong>{rateLimitTimer}s</strong>.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
              I am joining as: <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'student' })}
                className={`py-2.5 px-3 rounded-md border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                  formData.role === 'student'
                    ? 'border-teal-600 bg-teal-50 text-teal-800 shadow-sm'
                    : 'border-surface-border bg-white text-charcoal hover:bg-surface-hover'
                }`}
              >
                <span>Student</span>
                {formData.role === 'student' && <Check className="w-3.5 h-3.5 text-teal-600" />}
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'owner' })}
                className={`py-2.5 px-3 rounded-md border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                  formData.role === 'owner'
                    ? 'border-teal-600 bg-teal-50 text-teal-800 shadow-sm'
                    : 'border-surface-border bg-white text-charcoal hover:bg-surface-hover'
                }`}
              >
                <span>Property Owner</span>
                {formData.role === 'owner' && <Check className="w-3.5 h-3.5 text-teal-600" />}
              </button>
            </div>
            <p className="text-[11px] text-charcoal-muted mt-1">
              {formData.role === 'student'
                ? 'Discover student rooms, review terms, and submit booking applications.'
                : 'Publish rooms, toggle vacancy status, and review applicant students.'}
            </p>
          </div>

          <Input
            label="Full Name"
            id="full_name"
            name="full_name"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            error={errors.full_name}
            placeholder="e.g. Ayush Sharma"
          />

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
            placeholder="e.g. student@university.edu"
          />

          <Input
            label="Phone Number"
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
            placeholder="+919876543210"
            helperText="Protected: Only revealed to the counterparty upon accepted booking."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="gender" className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Gender (Optional)
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-surface-border rounded-md text-charcoal focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <Input
              label="Age (Optional)"
              id="age"
              name="age"
              type="number"
              min="16"
              max="120"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              error={errors.age}
              placeholder="e.g. 21"
            />
          </div>

          <div className="pt-1">
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
              Profile Photo (Optional)
            </label>
            <div className="flex items-center gap-3">
              <Avatar src={photoPreview} name={formData.full_name} size="lg" />
              <div className="flex-1">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-surface-border bg-surface-bg hover:bg-surface-hover rounded-md text-xs font-medium text-charcoal cursor-pointer transition-colors shadow-sm">
                  <Camera className="w-3.5 h-3.5 text-teal-600" />
                  <span>{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-charcoal-muted mt-1">
                  JPG, PNG or WebP up to 2MB.
                </p>
              </div>
            </div>
          </div>

          <Input
            label="Account Password"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            placeholder="At least 8 characters"
            helperText="Minimum 8 characters."
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            disabled={rateLimitTimer > 0}
            icon={UserPlus}
            className="w-full mt-2"
          >
            {rateLimitTimer > 0 ? `Wait ${rateLimitTimer}s` : 'Create Account'}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-surface-border text-xs text-charcoal-muted">
          <span>Already registered? </span>
          <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
