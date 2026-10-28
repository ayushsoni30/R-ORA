import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Send,
  Loader2,
  BedDouble,
  Check,
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [imgError, setImgError] = useState(false);

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
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        <p className="text-xs text-charcoal-muted">Loading property details...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-navy-800 mb-2">Room Not Found</h2>
        <p className="text-xs text-charcoal-muted mb-6">
          The requested listing could not be found or may have been removed by the owner.
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
  const ownerUploadedPhoto = (room.images && room.images.length > 0)
    ? room.images[0]
    : (room.image || null);

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
    if (list.length === 0) list.push('Study Friendly', 'Well Ventilated', 'Quiet Neighborhood');
    return list;
  };

  const amenities = extractAmenities(room.description);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <Link
          to="/rooms"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-navy-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Rooms</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-64 sm:h-96 bg-navy-50 rounded-xl border border-surface-border overflow-hidden shadow-card">
            {ownerUploadedPhoto && !imgError ? (
              <img
                src={ownerUploadedPhoto}
                alt={room.title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 p-6 select-none">
                <BedDouble className="w-16 h-16 mb-2 stroke-1" />
                <span className="text-xs font-semibold uppercase tracking-wider text-navy-800">
                  {ownerUploadedPhoto ? 'Image Unavailable' : 'No Photo Uploaded by Owner'}
                </span>
                <span className="text-[11px] text-charcoal-muted mt-1">
                  Owner will upload verified room photos via Cloudinary
                </span>
              </div>
            )}

            <div className="absolute top-4 right-4 shadow-subtle">
              <Badge variant={isAvailable ? 'available' : 'occupied'} size="md">
                {isAvailable ? 'Available for Rent' : 'Currently Occupied'}
              </Badge>
            </div>
          </div>

          <div className="bg-white border border-surface-border rounded-lg p-6 shadow-card space-y-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-navy-800 tracking-tight mb-2">
                {room.title}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-charcoal-muted">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{room.location}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-surface-border">
              <h2 className="text-xs font-semibold text-navy-800 uppercase tracking-wider mb-2">
                Room Description
              </h2>
              <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line">
                {room.description}
              </p>
            </div>

            <div className="pt-4 border-t border-surface-border">
              <h2 className="text-xs font-semibold text-navy-800 uppercase tracking-wider mb-3">
                Key Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-surface-bg border border-surface-border rounded text-xs text-charcoal"
                  >
                    <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-surface-border">
              <div className="bg-surface-bg p-3 rounded-md border border-surface-border">
                <div className="flex items-center gap-1.5 text-xs text-charcoal-muted mb-1">
                  <Users className="w-3.5 h-3.5 text-navy-800" />
                  <span>Max Occupants</span>
                </div>
                <p className="text-sm font-bold text-navy-800">
                  {room.max_occupants} {room.max_occupants === 1 ? 'Student' : 'Students'}
                </p>
              </div>

              <div className="bg-surface-bg p-3 rounded-md border border-surface-border">
                <div className="flex items-center gap-1.5 text-xs text-charcoal-muted mb-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span>Vacancy Date</span>
                </div>
                <p className="text-sm font-bold text-navy-800">
                  {room.expected_vacancy_date || 'Immediate'}
                </p>
              </div>

              <div className="bg-surface-bg p-3 rounded-md border border-surface-border col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-xs text-charcoal-muted mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Brokerage</span>
                </div>
                <p className="text-sm font-bold text-teal-700">
                  Zero Broker Fees
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-surface-border rounded-lg p-6 shadow-card sticky top-24 space-y-6">
            <div>
              <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider block mb-1">
                Monthly Rent
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-navy-800">
                  ₹{Number(room.monthly_rent).toLocaleString()}
                </span>
                <span className="text-xs text-charcoal-muted font-medium">/ month</span>
              </div>
            </div>

            <div className="pt-4 border-t border-surface-border space-y-4">
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
                <div className="bg-navy-50 border border-navy-200 rounded-md p-3 text-xs text-navy-900 space-y-1">
                  <p className="font-semibold">Owner Account Active</p>
                  <p>
                    You are logged in as a property owner. Only student accounts can submit booking requests for rooms.
                  </p>
                </div>
              ) : bookingSubmitted ? (
                <div className="bg-teal-50 border border-teal-200 rounded-md p-4 text-center space-y-2">
                  <CheckCircle className="w-6 h-6 text-teal-600 mx-auto" />
                  <p className="text-xs font-semibold text-teal-900">Request Submitted</p>
                  <p className="text-[11px] text-teal-700 leading-relaxed">
                    Your booking application is pending review by the property owner. Check your status in My Requests.
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
                    This room is currently occupied and cannot accept new booking requests.
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
                    No advance payment required. The owner reviews your request and confirms availability.
                  </p>
                </div>
              )}

              <div className="bg-surface-bg border border-surface-border rounded-md p-3 text-xs text-charcoal-muted space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-charcoal">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Protected Contact Notice</span>
                </div>
                <p className="text-[11px] text-charcoal-muted leading-relaxed">
                  The property owner's verified phone number and email will be unlocked only after your booking request is accepted.
                </p>
              </div>

              <div className="bg-amber-50/60 border border-amber-200/80 rounded-md p-3 text-xs text-amber-900 space-y-1">
                <p className="font-semibold text-[11px] text-amber-950">
                  Advance Payment Policy:
                </p>
                <p className="text-[11px] text-amber-900/90 leading-relaxed">
                  Any booking advance or token deposit paid directly to the owner after acceptance is strictly non-refundable as stated in our{' '}
                  <Link to="/terms" target="_blank" className="underline font-semibold text-amber-950 hover:text-teal-700">
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
