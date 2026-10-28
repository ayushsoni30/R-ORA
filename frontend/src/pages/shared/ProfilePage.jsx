import React, { useState, useEffect } from 'react';
import { Camera, Check, Trash2, Loader2, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    gender: '',
    age: '',
    profile_photo: '',
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        const data = await authService.getProfile();
        if (isMounted) {
          setFormData({
            full_name: data.full_name || '',
            phone: data.phone || '',
            gender: data.gender || '',
            age: data.age !== null && data.age !== undefined ? String(data.age) : '',
            profile_photo: data.profile_photo || '',
          });
          setPhotoPreview(data.profile_photo || null);
        }
      } catch (err) {
        if (isMounted) error(getErrorMessage(err));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [error]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      error('Please select an image file (PNG, JPG, or WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      error('Image size cannot exceed 2MB.');
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

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setFormData((prev) => ({ ...prev, profile_photo: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters';
    }

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must contain 10 to 15 digits (e.g. +919876543210)';
    }

    if (formData.age) {
      const parsedAge = parseInt(formData.age, 10);
      if (isNaN(parsedAge) || parsedAge < 16 || parsedAge > 120) {
        newErrors.age = 'Age must be between 16 and 120';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setErrors({});

    try {
      const res = await authService.updateProfile({
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender || null,
        age: formData.age ? parseInt(formData.age, 10) : null,
        profile_photo: formData.profile_photo || null,
      });

      updateUser({
        full_name: res.full_name,
        phone: res.phone,
        gender: res.gender,
        age: res.age,
        profile_photo: res.profile_photo,
      });

      success('Profile updated successfully!');
    } catch (err) {
      const msg = getErrorMessage(err);
      setErrors({ general: msg });
      error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        <p className="text-xs text-charcoal-muted">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-surface-border pb-5">
        <h1 className="text-2xl font-bold text-navy tracking-tight">
          Account Profile &amp; Settings
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Manage your personal details, profile photo, and contact information.
        </p>
      </div>

      <div className="bg-white border border-surface-border rounded-lg p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 p-5 bg-surface-bg rounded-lg border border-surface-border">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="relative group">
              <Avatar src={photoPreview} name={formData.full_name} size="2xl" />
              <label className="absolute bottom-0 right-0 p-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full cursor-pointer shadow-md transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <p className="font-bold text-charcoal text-base">{formData.full_name || user?.full_name}</p>
              <p className="text-xs text-charcoal-muted">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <Badge variant={user?.role === 'owner' ? 'owner' : 'student'} size="sm">
                  {user?.role === 'owner' ? 'Room Owner' : 'Student Seeker'}
                </Badge>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-xs text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 font-medium"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {errors.general && (
          <div className="bg-rose-50 border border-rose-200 rounded-md p-3 text-xs text-rose-800">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            id="full_name"
            name="full_name"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            error={errors.full_name}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-surface-border rounded-md text-charcoal focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <Input
              label="Age"
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

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3 py-2 text-sm bg-slate-100 border border-surface-border rounded-md text-charcoal-muted cursor-not-allowed"
            />
            <p className="text-[11px] text-charcoal-subtle mt-1">
              Email address is permanent and cannot be modified.
            </p>
          </div>

          <Input
            label="Contact Phone Number"
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
            helperText="Direct contact is revealed only after a booking is accepted."
          />

          <div className="pt-4 border-t border-surface-border flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-charcoal-muted">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Contact details protected by Roomora Privacy Policy</span>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
              icon={Check}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
