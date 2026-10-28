import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Send,
  Loader2,
  Home,
  Check,
  Building,
  Lock,
} from 'lucide-react';
import { roomService } from '../../services/roomService';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent, isOwner } = useAuth();
  const { success, error, warning } = useToast();

  const [room, setRoom] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    let isMounted = true;
    async function loadRoom() {
      try {
        const data = await roomService.getRoomById(id);
        if (isMounted) setRoom(data);
      } catch (err) {
        if (isMounted) {
          error(getErrorMessage(err));
          setRoom(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadRoom();
    return () => {
      isMounted = false;
    };
  }, [id, error]);

  const handleBookingRequest = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/rooms/${id}` } });
      return;
    }

    if (!isStudent) {
      warning('Only student accounts can send room booking requests.');
      return;
    }

    setIsSubmitting(true);
    try {
      await bookingService.createBooking(id);
      setBookingSubmitted(true);
      success('Booking request submitted successfully! You can track its status in My Requests.');
    } catch (err) {
      const msg = getErrorMessage(err);
      if (err.response?.status === 409) {
        setBookingSubmitted(true);
        warning('You already have a pending booking request for this property.');
      } else {
        error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-forest-800" />
        <p className="text-xs text-charcoal-muted">Loading room details...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center bg-white border border-warm-border rounded-lg p-8 my-8 shadow-subtle">
        <h2 className="text-xl font-bold text-charcoal mb-2">Room Listing Not Found</h2>
        <p className="text-xs sm:text-sm text-charcoal-muted mb-6">
          The requested listing could not be found or may have been unlisted by the property owner.
        </p>
        <Link to="/rooms">
          <Button variant="outline" size="sm" icon={ArrowLeft}>
            Back to Room Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const isAvailable = room.status === 'available';
  const roomImages = (room.images && room.images.length > 0)
    ? room.images
    : (room.image ? [room.image] : []);

  const activePhoto = roomImages[selectedImageIndex] || null;

  const extractAmenities = (desc = '') => {
    const list = [];
    const lower = desc.toLowerCase();
    if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('internet')) list.push('High-Speed WiFi');
    if (lower.includes('furnish') || lower.includes('bed') || lower.includes('wardrobe')) list.push('Fully Furnished');
    if (lower.includes('desk') || lower.includes('study') || lower.includes('table')) list.push('Dedicated Study Desk');
    if (lower.includes('ac') || lower.includes('air condition')) list.push('Air Conditioning');
    if (lower.includes('bath') || lower.includes('attached')) list.push('Attached Bathroom');
    if (lower.includes('kitchen') || lower.includes('cook')) list.push('Shared Kitchen');
    if (lower.includes('power') || lower.includes('backup')) list.push('Power Backup');
    if (list.length === 0) list.push('Quiet Study Environment', 'Well Ventilated', 'Safe Student Locality');
    return list;
  };

  const amenities = extractAmenities(room.description);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/rooms"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-muted hover:text-forest-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Rooms</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery & Room Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Gallery Display */}
          <div className="bg-white border border-warm-border rounded-xl overflow-hidden shadow-subtle p-3 space-y-3">
            <div className="relative aspect-[16/10] bg-warm-muted rounded-lg overflow-hidden border border-warm-border">
              {activePhoto && !imgErrors[selectedImageIndex] ? (
                <img
                  src={activePhoto}
                  alt={`${room.title} photo ${selectedImageIndex + 1}`}
                  onError={() => setImgErrors((prev) => ({ ...prev, [selectedImageIndex]: true }))}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-charcoal-muted bg-warm-muted p-6 select-none">
                  <Home className="w-14 h-14 mb-2 stroke-[1.5] text-charcoal-muted/60" />
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
                    {activePhoto ? 'Image Unavailable' : 'No Room Photo Uploaded'}
                  </span>
                  <span className="text-[11px] text-charcoal-muted mt-1">
                    Verified property images are uploaded directly by the room owner
                  </span>
                </div>
              )}

              {/* Status Badge in gallery corner */}
              <div className="absolute top-4 right-4 shadow-subtle">
                <Badge variant={isAvailable ? 'available' : 'occupied'} size="md">
                  {isAvailable ? 'Available for Rent' : 'Currently Occupied'}
                </Badge>
              </div>
            </div>

            {/* Thumbnail Strip (if multiple photos exist) */}
            {roomImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {roomImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-md overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-forest-800 ring-2 ring-forest-800/20'
                        : 'border-warm-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Room Title, Location, Specs */}
          <div className="bg-white border border-warm-border rounded-lg p-6 sm:p-8 shadow-subtle space-y-6">
            <div className="border-b border-warm-border pb-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight mb-2">
                {room.title}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-charcoal-muted font-medium">
                <MapPin className="w-4 h-4 text-forest-800 shrink-0" />
                <span>{room.location}</span>
              </div>
            </div>

            {/* Key Specs Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-warm-bg rounded-lg border border-warm-border">
                <div className="flex items-center gap-1.5 text-xs text-charcoal-muted mb-1 font-semibold">
                  <Users className="w-3.5 h-3.5 text-forest-800" />
                  <span>Capacity</span>
                </div>
                <p className="text-sm font-bold text-charcoal">
                  Max {room.max_occupants} {room.max_occupants === 1 ? 'Student' : 'Students'}
                </p>
              </div>

              <div className="p-3.5 bg-warm-bg rounded-lg border border-warm-border">
                <div className="flex items-center gap-1.5 text-xs text-charcoal-muted mb-1 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-forest-800" />
                  <span>Expected Vacancy</span>
                </div>
                <p className="text-sm font-bold text-charcoal">
                  {room.expected_vacancy_date || 'Available Immediately'}
                </p>
              </div>

              <div className="p-3.5 bg-warm-bg rounded-lg border border-warm-border col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-xs text-charcoal-muted mb-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-forest-800" />
                  <span>Brokerage</span>
                </div>
                <p className="text-sm font-bold text-forest-800">
                  Zero Broker Fees
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="pt-2">
              <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2.5">
                Room Description
              </h2>
              <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line">
                {room.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="pt-2 border-t border-warm-border">
              <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">
                Key Features &amp; Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 bg-warm-bg border border-warm-border rounded-md text-xs font-semibold text-charcoal"
                  >
                    <Check className="w-3.5 h-3.5 text-forest-800 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Booking Action Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-warm-border rounded-lg p-6 shadow-card sticky top-24 space-y-6">
            <div>
              <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                Monthly Rent
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-charcoal">
                  ₹{Number(room.monthly_rent).toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-charcoal-muted">/ month</span>
              </div>
            </div>

            <div className="pt-4 border-t border-warm-border space-y-4">
              {/* Contextual Action depending on auth & role */}
              {!isAuthenticated ? (
                <div className="space-y-3">
                  <Link to="/login" state={{ from: `/rooms/${id}` }} className="w-full block">
                    <Button variant="primary" size="lg" className="w-full">
                      Sign in as Student to Book
                    </Button>
                  </Link>
                  <p className="text-[11px] text-charcoal-muted text-center leading-relaxed">
                    Students must log in to submit room requests.
                  </p>
                </div>
              ) : isOwner ? (
                <div className="bg-warm-bg border border-warm-border rounded-md p-3.5 text-xs text-charcoal space-y-1">
                  <p className="font-bold text-charcoal">Owner Account Active</p>
                  <p className="text-charcoal-muted">
                    You are signed in as a property owner. Only student seeker accounts can submit room requests.
                  </p>
                </div>
              ) : bookingSubmitted ? (
                <div className="bg-sage border border-sage-300 rounded-md p-4 text-center space-y-2">
                  <CheckCircle2 className="w-6 h-6 text-forest-800 mx-auto" />
                  <p className="text-xs font-bold text-forest-900">Request Submitted</p>
                  <p className="text-[11px] text-forest-800 leading-relaxed">
                    Your booking request is pending review by the room owner. You can track status in your dashboard.
                  </p>
                  <Link to="/student/bookings" className="block pt-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      View My Requests
                    </Button>
                  </Link>
                </div>
              ) : !isAvailable ? (
                <div className="space-y-3">
                  <Button variant="secondary" size="lg" disabled className="w-full opacity-60 cursor-not-allowed">
                    Room Currently Occupied
                  </Button>
                  <p className="text-[11px] text-charcoal-muted text-center leading-relaxed">
                    This accommodation is currently occupied and not taking immediate bookings. Check expected vacancy date.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    onClick={handleBookingRequest}
                    icon={Send}
                    className="w-full"
                  >
                    Submit Booking Request
                  </Button>
                  <p className="text-[11px] text-charcoal-muted text-center leading-relaxed">
                    Zero application fees. The property owner reviews your profile and confirms availability.
                  </p>
                </div>
              )}

              {/* Protected Owner Contact Notice */}
              <div className="bg-warm-bg border border-warm-border rounded-md p-3.5 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-charcoal">
                  <Lock className="w-3.5 h-3.5 text-forest-800" />
                  <span>Protected Contact Privacy</span>
                </div>
                <p className="text-[11px] text-charcoal-muted leading-relaxed">
                  The property owner's verified phone number and email are unlocked only after your booking request is accepted.
                </p>
              </div>

              {/* Advance policy note */}
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3.5 text-xs text-amber-950 space-y-1">
                <p className="font-bold text-[11px]">
                  Deposit / Advance Notice:
                </p>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  Any booking advance or token deposit paid directly to the owner after acceptance is non-refundable as stated in the{' '}
                  <Link to="/terms" target="_blank" className="underline font-bold hover:text-forest-800">
                    Terms &amp; Conditions
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
