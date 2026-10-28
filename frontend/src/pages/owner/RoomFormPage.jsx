import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  AlertCircle,
  Loader2,
  Upload,
  Camera,
  Trash2,
  CheckCircle2,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react';
import { roomService } from '../../services/roomService';
import { uploadImageToCloudinary, isCloudinaryConfigured } from '../../services/cloudinaryService';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../services/api';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import { Button } from '../../components/common/Button';

export const RoomFormPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { success, error, warning } = useToast();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    monthly_rent: '',
    max_occupants: 1,
    expected_vacancy_date: '',
    images: [],
  });

  const [imageInputUrl, setImageInputUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    let isMounted = true;
    async function loadRoomData() {
      if (location.state?.room) {
        const r = location.state.room;
        setFormData({
          title: r.title || '',
          description: r.description || '',
          location: r.location || '',
          monthly_rent: r.monthly_rent || '',
          max_occupants: r.max_occupants || 1,
          expected_vacancy_date: r.expected_vacancy_date || '',
          images: r.images || (r.image ? [r.image] : []),
        });
        setIsLoading(false);
        return;
      }

      try {
        const data = await roomService.getRoomById(id);
        if (isMounted) {
          setFormData({
            title: data.title || '',
            description: data.description || '',
            location: data.location || '',
            monthly_rent: data.monthly_rent || '',
            max_occupants: data.max_occupants || 1,
            expected_vacancy_date: data.expected_vacancy_date || '',
            images: data.images || (data.image ? [data.image] : []),
          });
        }
      } catch (err) {
        if (isMounted) {
          error(getErrorMessage(err));
          navigate('/owner/rooms');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadRoomData();
    return () => {
      isMounted = false;
    };
  }, [id, isEditMode, location.state, error, navigate]);

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      setFormData((prev) => ({
        ...prev,
        images: [uploadedUrl, ...(prev.images || [])],
      }));
      success(
        isCloudinaryConfigured()
          ? 'Image uploaded to Cloudinary successfully!'
          : 'Image selected and optimized successfully!'
      );
    } catch (err) {
      error(err.message || 'Failed to upload room image.');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    const url = imageInputUrl.trim();
    if (!url) return;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      error('Please enter a valid HTTP/HTTPS image URL.');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [url, ...(prev.images || [])],
    }));
    setImageInputUrl('');
    setShowUrlInput(false);
    success('Room image URL added.');
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3 || formData.title.trim().length > 100) {
      newErrors.title = 'Title must be between 3 and 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10 || formData.description.trim().length > 1000) {
      newErrors.description = 'Description must be between 10 and 1000 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location address is required';
    } else if (formData.location.trim().length < 2 || formData.location.trim().length > 200) {
      newErrors.location = 'Location must be between 2 and 200 characters';
    }

    const rent = parseFloat(formData.monthly_rent);
    if (isNaN(rent) || rent <= 0) {
      newErrors.monthly_rent = 'Monthly rent must be a positive number';
    }

    const occ = parseInt(formData.max_occupants, 10);
    if (isNaN(occ) || occ < 1 || occ > 20) {
      newErrors.max_occupants = 'Occupants must be between 1 and 20';
    }

    if (formData.expected_vacancy_date) {
      const selected = new Date(formData.expected_vacancy_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.expected_vacancy_date = 'Vacancy date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      monthly_rent: parseFloat(formData.monthly_rent),
      max_occupants: parseInt(formData.max_occupants, 10),
      expected_vacancy_date: formData.expected_vacancy_date || null,
      images: formData.images || [],
    };

    try {
      if (isEditMode) {
        await roomService.updateRoom(id, payload);
        success('Room listing updated successfully!');
      } else {
        await roomService.createRoom(payload);
        success('Room listing posted successfully!');
      }
      navigate('/owner/rooms');
    } catch (err) {
      const msg = getErrorMessage(err);
      setErrors({ general: msg });
      error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-forest-800" />
        <p className="text-xs text-charcoal-muted">Loading room listing...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <Link
          to="/owner/rooms"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-muted hover:text-forest-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Listings</span>
        </Link>
      </div>

      <div className="bg-white border border-warm-border rounded-xl p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="border-b border-warm-border pb-4">
          <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal tracking-tight">
            {isEditMode ? 'Edit Room Listing' : 'List a New Student Room'}
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Provide room details, pricing, occupant capacity, and authentic photos for students.
          </p>
        </div>

        {errors.general && (
          <div className="bg-rose-50 border border-rose-200 rounded-md p-3 flex items-start gap-2 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-forest-800">
              1. Basic Information
            </h2>

            <Input
              label="Property / Room Title"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={errors.title}
              placeholder="e.g. Spacious Single Bedroom near University Campus"
              helperText="3 to 100 characters."
            />

            <Input
              label="Location & Address"
              id="location"
              name="location"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={errors.location}
              placeholder="e.g. Sector 62, Near Metro Station, Noida"
              helperText="Clear location helps students find rooms through search."
            />
          </div>

          {/* Section 2: Pricing & Occupancy */}
          <div className="space-y-4 pt-4 border-t border-warm-border">
            <h2 className="text-xs font-bold uppercase tracking-wider text-forest-800">
              2. Pricing &amp; Occupancy
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Monthly Rent (₹ INR)"
                id="monthly_rent"
                name="monthly_rent"
                type="number"
                min="1"
                step="any"
                required
                value={formData.monthly_rent}
                onChange={(e) => setFormData({ ...formData, monthly_rent: e.target.value })}
                error={errors.monthly_rent}
                placeholder="e.g. 7500"
              />

              <Input
                label="Max Student Occupants"
                id="max_occupants"
                name="max_occupants"
                type="number"
                min="1"
                max="20"
                required
                value={formData.max_occupants}
                onChange={(e) => setFormData({ ...formData, max_occupants: e.target.value })}
                error={errors.max_occupants}
              />
            </div>

            <Input
              label="Expected Vacancy Date"
              id="expected_vacancy_date"
              name="expected_vacancy_date"
              type="date"
              value={formData.expected_vacancy_date}
              onChange={(e) => setFormData({ ...formData, expected_vacancy_date: e.target.value })}
              error={errors.expected_vacancy_date}
              helperText="Leave empty if the room is available immediately."
            />
          </div>

          {/* Section 3: Room Description & Amenities */}
          <div className="space-y-4 pt-4 border-t border-warm-border">
            <h2 className="text-xs font-bold uppercase tracking-wider text-forest-800">
              3. Room Details &amp; Amenities
            </h2>

            <Textarea
              label="Room Description & Amenities"
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={errors.description}
              placeholder="Describe the room, furniture, WiFi, attached bathroom, proximity to university, study desk, etc."
              helperText="10 to 1000 characters."
            />
          </div>

          {/* Section 4: Photography */}
          <div className="space-y-3 pt-4 border-t border-warm-border">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                  Room Photos
                </label>
                <p className="text-[11px] text-charcoal-muted mt-0.5">
                  Upload authentic photographs of the room and amenities.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-xs text-forest-800 hover:text-forest-900 font-semibold inline-flex items-center gap-1"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>{showUrlInput ? 'Hide URL Input' : 'Paste Image URL'}</span>
              </button>
            </div>

            {showUrlInput && (
              <div className="flex gap-2 p-3 bg-warm-bg border border-warm-border rounded-md">
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/.../room.jpg"
                  value={imageInputUrl}
                  onChange={(e) => setImageInputUrl(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 bg-white border border-warm-border rounded-md text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
                <Button variant="secondary" size="sm" onClick={handleAddImageUrl}>
                  Add URL
                </Button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-warm-border hover:border-forest-800 hover:bg-sage/40 rounded-md text-xs font-bold text-charcoal cursor-pointer transition-colors shadow-subtle">
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-forest-800" />
                    <span>Uploading Image...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-forest-800" />
                    <span>Upload Room Photo</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageFileUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
              </label>

              <span className="text-[11px] text-charcoal-muted">
                Accepts JPG, PNG, or WebP up to 5MB.
              </span>
            </div>

            {/* Uploaded Images Preview Grid */}
            {formData.images && formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {formData.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[16/10] rounded-lg overflow-hidden border border-warm-border group shadow-subtle bg-warm-muted"
                  >
                    <img
                      src={imgUrl}
                      alt={`Room photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-charcoal/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-md shadow"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {idx === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 bg-charcoal/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Cover Photo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-warm-border flex items-center justify-end gap-3">
            <Link to="/owner/rooms">
              <Button variant="outline" size="md" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
            >
              {isEditMode ? 'Save Changes' : 'Publish Room Listing'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
