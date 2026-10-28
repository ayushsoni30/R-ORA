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
  ExternalLink,
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { roomService } from '../../services/roomService';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { Avatar } from '../../components/common/Avatar';

export const StudentBookingsPage = () => {
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
      setBookings(data);

      const roomIds = [...new Set(data.map((b) => b.room_id))];
      const roomsMap = {};
      await Promise.all(
        roomIds.map(async (rId) => {
          try {
            const rData = await roomService.getRoomById(rId);
            roomsMap[rId] = rData;
          } catch {
            roomsMap[rId] = { title: 'Room listing unavailable', location: 'Unknown' };
          }
        })
      );
      setRoomDetailsMap(roomsMap);

      const contactsMap = {};
      await Promise.all(
        data
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-surface-border pb-5">
        <h1 className="text-2xl font-bold text-navy tracking-tight">
          My Room Booking Requests
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Track the status of your applications and view room owner contact details (phone &amp; email) once accepted.
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
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
                className="bg-white border border-surface-border rounded-lg p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-navy text-base">
                        {room.title || 'Room Listing'}
                      </h3>
                      <Badge variant={booking.status} size="sm">
                        {booking.status.toUpperCase()}
                      </Badge>
                    </div>
                    {room.location && (
                      <div className="flex items-center text-xs text-charcoal-muted gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        <span>{room.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto text-xs text-charcoal-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-navy-600" />
                      Requested on {createdDate}
                    </span>
                    {room.monthly_rent && (
                      <span className="font-bold text-navy bg-navy-50 px-2 py-0.5 rounded border border-navy-100">
                        ₹{Number(room.monthly_rent).toLocaleString()} / mo
                      </span>
                    )}
                  </div>
                </div>

                {isAccepted && (
                  <div className="bg-teal-50/70 border border-teal-200 rounded-md p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
                        <BookmarkCheck className="w-4 h-4 text-teal-600" />
                        <span>Request Accepted! Room Owner Contact Information Disclosed</span>
                      </div>
                      <Badge variant="accepted" size="sm">
                        Direct Contact Access
                      </Badge>
                    </div>

                    {ownerContact ? (
                      <div className="p-4 bg-white rounded-lg border border-teal-100 space-y-3">
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                          <div className="flex items-center justify-between p-2.5 bg-surface-bg rounded border border-surface-border">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-teal-600" />
                              <div>
                                <span className="text-[10px] text-charcoal-subtle uppercase block font-semibold">
                                  Owner Phone Number
                                </span>
                                <span className="font-bold text-navy">{ownerContact.phone}</span>
                              </div>
                            </div>
                            <a
                              href={`tel:${ownerContact.phone}`}
                              className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded transition-colors"
                            >
                              Call
                            </a>
                          </div>

                          <div className="flex items-center justify-between p-2.5 bg-surface-bg rounded border border-surface-border">
                            <div className="flex items-center gap-2 min-w-0">
                              <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                              <div className="min-w-0">
                                <span className="text-[10px] text-charcoal-subtle uppercase block font-semibold">
                                  Owner Email Address
                                </span>
                                <span className="font-bold text-navy truncate block">
                                  {ownerContact.email}
                                </span>
                              </div>
                            </div>
                            <a
                              href={`mailto:${ownerContact.email}`}
                              className="px-2.5 py-1 bg-navy-700 hover:bg-navy-800 text-white font-medium text-xs rounded transition-colors shrink-0"
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

                {isPending && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-bg border border-surface-border rounded-md p-3.5 text-xs text-charcoal-muted">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-charcoal-subtle shrink-0" />
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

                {isRejected && (
                  <div className="bg-rose-50 border border-rose-200 rounded-md p-3 text-xs text-rose-800 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      This booking request was declined or the room was occupied by another applicant.
                    </span>
                  </div>
                )}

                {isCancelled && (
                  <div className="bg-slate-50 border border-surface-border rounded-md p-3 text-xs text-charcoal-muted">
                    You cancelled this booking request.
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <Link
                    to={`/rooms/${booking.room_id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700"
                  >
                    <span>View Property Details</span>
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
          description="You haven't requested any rooms yet. Browse our catalog and submit a request to get started."
          action={
            <Link to="/rooms">
              <Button variant="primary" size="sm">
                Discover Available Rooms
              </Button>
            </Link>
          }
        />
      )}

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
              Yes, Cancel Request
            </Button>
          </>
        }
      >
        <p className="text-xs text-charcoal-muted leading-relaxed">
          Are you sure you want to cancel this booking request? The room owner will no longer see your application.
        </p>
      </Modal>
    </div>
  );
};
