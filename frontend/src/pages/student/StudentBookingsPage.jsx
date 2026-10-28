import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  BookmarkCheck,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  XCircle,
  Clock,
  Compass,
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { roomService } from '../../services/roomService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { Avatar } from '../../components/common/Avatar';

export const StudentBookingsPage = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [bookings, setBookings] = useState([]);
  const [roomDetailsMap, setRoomDetailsMap] = useState({});
  const [ownerContactMap, setOwnerContactMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data || []);

      const roomIds = [...new Set((data || []).map((b) => b.room_id))];
      const roomsMap = {};
      await Promise.all(
        roomIds.map(async (rId) => {
          try {
            const rData = await roomService.getRoomById(rId);
            roomsMap[rId] = rData;
          } catch {
            roomsMap[rId] = { title: 'Room listing unavailable', location: 'Location unavailable' };
          }
        })
      );
      setRoomDetailsMap(roomsMap);

      const contactsMap = {};
      await Promise.all(
        (data || [])
          .filter((b) => b.status === 'accepted')
          .map(async (b) => {
            try {
              const cData = await bookingService.getOwnerContact(b.id);
              contactsMap[b.id] = cData;
            } catch {
              contactsMap[b.id] = null;
            }
          })
      );
      setOwnerContactMap(contactsMap);
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const promptCancel = (id) => {
    setCancellingId(id);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingId) return;
    setIsCancelling(true);
    try {
      await bookingService.cancelBooking(cancellingId);
      success('Booking request cancelled successfully.');
      setIsCancelModalOpen(false);
      setCancellingId(null);
      fetchBookings();
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setIsCancelling(false);
    }
  };

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const acceptedCount = bookings.filter((b) => b.status === 'accepted').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Welcome & Overview Header */}
      <div className="bg-white border border-warm-border rounded-xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar src={user?.profile_photo} name={user?.full_name} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal tracking-tight">
                Welcome back, {user?.full_name}
              </h1>
              <Badge variant="student" size="sm">
                Student Seeker
              </Badge>
            </div>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Track your room applications and access room owner contact details once accepted.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/rooms">
            <Button variant="secondary" size="sm" icon={Compass}>
              Browse Rooms
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="outline" size="sm">
              My Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Booking Requests Status Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white border border-warm-border rounded-lg p-3.5 shadow-subtle">
          <span className="text-charcoal-muted uppercase tracking-wider font-semibold block text-[11px]">
            Total Requests
          </span>
          <span className="text-xl font-extrabold text-charcoal mt-1 block">
            {bookings.length}
          </span>
        </div>
        <div className="bg-white border border-warm-border rounded-lg p-3.5 shadow-subtle">
          <span className="text-amber-800 uppercase tracking-wider font-semibold block text-[11px]">
            Pending Review
          </span>
          <span className="text-xl font-extrabold text-amber-800 mt-1 block">
            {pendingCount}
          </span>
        </div>
        <div className="bg-white border border-warm-border rounded-lg p-3.5 shadow-subtle">
          <span className="text-forest-800 uppercase tracking-wider font-semibold block text-[11px]">
            Accepted
          </span>
          <span className="text-xl font-extrabold text-forest-800 mt-1 block">
            {acceptedCount}
          </span>
        </div>
        <div className="bg-white border border-warm-border rounded-lg p-3.5 shadow-subtle">
          <span className="text-charcoal-muted uppercase tracking-wider font-semibold block text-[11px]">
            Owner Access
          </span>
          <span className="text-xs font-bold text-charcoal mt-1 block">
            {acceptedCount > 0 ? `${acceptedCount} Disclosed` : 'Protected'}
          </span>
        </div>
      </div>

      {/* Main Booking Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-warm-border pb-3">
          <h2 className="text-lg font-bold text-charcoal">
            Booking Request History
          </h2>
          <span className="text-xs text-charcoal-muted">
            {bookings.length} {bookings.length === 1 ? 'application' : 'applications'}
          </span>
        </div>

        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-forest-800" />
            <p className="text-xs text-charcoal-muted">Loading your booking requests...</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const room = roomDetailsMap[booking.room_id] || {};
              const ownerContact = ownerContactMap[booking.id];
              const isPending = booking.status === 'pending';
              const isAccepted = booking.status === 'accepted';
              const isRejected = booking.status === 'rejected';
              const isCancelled = booking.status === 'cancelled';

              const createdDate = booking.created_at
                ? new Date(booking.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Recently';

              return (
                <div
                  key={booking.id}
                  className="bg-white border border-warm-border rounded-lg p-5 shadow-subtle space-y-4"
                >
                  {/* Card Header: Room Info & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-warm-border pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-charcoal text-base">
                          {room.title || 'Room Listing'}
                        </h3>
                        <Badge variant={booking.status} size="sm">
                          {booking.status.toUpperCase()}
                        </Badge>
                      </div>
                      {room.location && (
                        <div className="flex items-center text-xs text-charcoal-muted gap-1 mt-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-forest-800" />
                          <span>{room.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto text-xs text-charcoal-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-charcoal-muted" />
                        Requested {createdDate}
                      </span>
                      {room.monthly_rent && (
                        <span className="font-bold text-charcoal bg-warm-bg px-2.5 py-0.5 rounded border border-warm-border">
                          ₹{Number(room.monthly_rent).toLocaleString()} / mo
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Accepted State: Owner Contact Details Disclosed */}
                  {isAccepted && (
                    <div className="bg-sage border border-sage-300 rounded-lg p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-forest-900">
                          <BookmarkCheck className="w-4 h-4 text-forest-800" />
                          <span>Request Accepted — Property Owner Contact Details Disclosed</span>
                        </div>
                        <Badge variant="accepted" size="sm">
                          Direct Access
                        </Badge>
                      </div>

                      {ownerContact ? (
                        <div className="p-4 bg-white rounded-lg border border-warm-border space-y-3">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={ownerContact.profile_photo}
                              name={ownerContact.owner_name}
                              size="md"
                            />
                            <div>
                              <p className="font-bold text-charcoal text-sm">
                                {ownerContact.owner_name}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-charcoal-muted">
                                <Badge variant="owner" size="sm">Property Owner</Badge>
                                {ownerContact.gender && <span>• {ownerContact.gender}</span>}
                                {ownerContact.age && <span>• {ownerContact.age} yrs</span>}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-warm-border text-xs">
                            <div className="flex items-center justify-between p-2.5 bg-warm-bg rounded border border-warm-border">
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-forest-800" />
                                <div>
                                  <span className="text-[10px] text-charcoal-muted uppercase block font-bold">
                                    Phone Number
                                  </span>
                                  <span className="font-bold text-charcoal">{ownerContact.phone}</span>
                                </div>
                              </div>
                              <a
                                href={`tel:${ownerContact.phone}`}
                                className="px-3 py-1 bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs rounded transition-colors"
                              >
                                Call
                              </a>
                            </div>

                            <div className="flex items-center justify-between p-2.5 bg-warm-bg rounded border border-warm-border">
                              <div className="flex items-center gap-2 min-w-0">
                                <Mail className="w-4 h-4 text-forest-800 shrink-0" />
                                <div className="min-w-0">
                                  <span className="text-[10px] text-charcoal-muted uppercase block font-bold">
                                    Email Address
                                  </span>
                                  <span className="font-bold text-charcoal truncate block">
                                    {ownerContact.email}
                                  </span>
                                </div>
                              </div>
                              <a
                                href={`mailto:${ownerContact.email}`}
                                className="px-3 py-1 bg-charcoal hover:bg-black text-white font-semibold text-xs rounded transition-colors shrink-0"
                              >
                                Email
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-charcoal-muted">Fetching owner contact details...</p>
                      )}
                    </div>
                  )}

                  {/* Pending State */}
                  {isPending && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-warm-bg border border-warm-border rounded-md p-3.5 text-xs text-charcoal-muted">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-charcoal-muted shrink-0" />
                        <span>
                          Owner phone number and email remain protected until your application is accepted.
                        </span>
                      </div>
                      <Button
                        variant="danger-outline"
                        size="sm"
                        onClick={() => promptCancel(booking.id)}
                      >
                        Cancel Request
                      </Button>
                    </div>
                  )}

                  {/* Rejected State */}
                  {isRejected && (
                    <div className="bg-rose-50 border border-rose-200 rounded-md p-3 text-xs text-rose-800 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>
                        This booking request was declined or the room was occupied by another applicant.
                      </span>
                    </div>
                  )}

                  {/* Cancelled State */}
                  {isCancelled && (
                    <div className="bg-warm-muted border border-warm-border rounded-md p-3 text-xs text-charcoal-muted">
                      You cancelled this booking request.
                    </div>
                  )}

                  {/* Action Link to Room */}
                  <div className="flex justify-end pt-1">
                    <Link
                      to={`/rooms/${booking.room_id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-forest-800 hover:text-forest-900"
                    >
                      <span>View Room Listing</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={BookmarkCheck}
            title="No booking requests yet"
            description="You haven't requested any rooms yet. Explore our listings to find accommodations near your campus."
            action={
              <Link to="/rooms">
                <Button variant="primary" size="sm">
                  Find Rooms Now
                </Button>
              </Link>
            }
          />
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Booking Request"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCancelModalOpen(false)}
              disabled={isCancelling}
            >
              Keep Request
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isCancelling}
              onClick={handleConfirmCancel}
            >
              Confirm Cancellation
            </Button>
          </>
        }
      >
        <p className="text-xs text-charcoal leading-relaxed">
          Are you sure you want to cancel this booking request? The room owner will no longer see your application.
        </p>
      </Modal>
    </div>
  );
};
