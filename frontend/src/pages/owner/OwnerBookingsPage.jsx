import React, { useState, useEffect, useCallback } from 'react';
import {
  Inbox,
  Check,
  X,
  Phone,
  Mail,
  User,
  Calendar,
  Building2,
  AlertCircle,
  Loader2,
  CheckCircle2,
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

export const OwnerBookingsPage = () => {
  const { success, error } = useToast();

  const [bookings, setBookings] = useState([]);
  const [roomMap, setRoomMap] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [decisionAction, setDecisionAction] = useState(null);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchOwnerBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await bookingService.getOwnerBookings();
      setBookings(data);

      const uniqueRoomIds = [...new Set(data.map((b) => b.room_id))];
      const rMap = {};
      await Promise.all(
        uniqueRoomIds.map(async (rId) => {
          try {
            const rData = await roomService.getRoomById(rId);
            rMap[rId] = rData;
          } catch {
            rMap[rId] = { title: 'Room listing unavailable' };
          }
        })
      );
      setRoomMap(rMap);
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchOwnerBookings();
  }, [fetchOwnerBookings]);

  const promptDecision = (booking, action) => {
    setSelectedBooking(booking);
    setDecisionAction(action);
    setIsDecisionModalOpen(true);
  };

  const handleExecuteDecision = async () => {
    if (!selectedBooking || !decisionAction) return;

    setIsProcessing(true);
    try {
      await bookingService.updateBookingStatus(selectedBooking.id, decisionAction);
      if (decisionAction === 'accepted') {
        success('Booking accepted! The room has been marked occupied and competing requests resolved.');
      } else {
        success('Booking request rejected.');
      }
      setIsDecisionModalOpen(false);
      setSelectedBooking(null);
      setDecisionAction(null);
      fetchOwnerBookings();
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-5">
        <div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">
            Booking Requests Inbox
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Review incoming accommodation applications from students with full applicant profiles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-md self-start sm:self-auto text-xs font-medium">
          {['all', 'pending', 'accepted', 'rejected'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 rounded transition-colors uppercase text-[11px] font-semibold tracking-wider ${
                statusFilter === tab
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-charcoal-muted hover:text-navy'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <p className="text-xs text-charcoal-muted">Loading booking inbox...</p>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const room = roomMap[booking.room_id] || {};
            const isPending = booking.status === 'pending';
            const isAccepted = booking.status === 'accepted';
            const isRejected = booking.status === 'rejected';

            const createdDate = booking.created_at
              ? new Date(booking.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
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
                      <span className="font-bold text-navy text-base">
                        {room.title || 'Room Listing'}
                      </span>
                      <Badge variant={booking.status} size="sm">
                        {booking.status.toUpperCase()}
                      </Badge>
                    </div>
                    {room.location && (
                      <p className="text-xs text-charcoal-muted mt-0.5">{room.location}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto text-xs text-charcoal-muted">
                    {room.monthly_rent && (
                      <span className="font-bold text-navy bg-navy-50 px-2 py-0.5 rounded border border-navy-100">
                        ₹{Number(room.monthly_rent).toLocaleString()} / mo
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      Submitted: {createdDate}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-surface-bg rounded-lg border border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={booking.student_photo}
                      name={booking.student_name}
                      size="lg"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-charcoal text-sm">
                          {booking.student_name || 'Student Applicant'}
                        </h4>
                        <Badge variant="student" size="sm">
                          Student Applicant
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-muted mt-1">
                        {booking.student_gender && (
                          <span className="inline-flex items-center gap-1">
                            <span className="text-charcoal font-medium">Gender:</span> {booking.student_gender}
                          </span>
                        )}
                        {booking.student_age && (
                          <span className="inline-flex items-center gap-1">
                            <span className="text-charcoal font-medium">Age:</span> {booking.student_age} yrs old
                          </span>
                        )}
                        {!booking.student_gender && !booking.student_age && (
                          <span className="text-charcoal-subtle italic">Demographics not specified</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isPending && (
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Check}
                        onClick={() => promptDecision(booking, 'accepted')}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger-outline"
                        size="sm"
                        icon={X}
                        onClick={() => promptDecision(booking, 'rejected')}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </div>

                {isAccepted && (
                  <div className="bg-teal-50 border border-teal-200 rounded-md p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        <span>Accepted Booking - Student Direct Contact Information</span>
                      </div>
                      <Badge variant="accepted" size="sm">
                        Verified Contact
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-charcoal">
                      <div className="bg-white p-3 rounded border border-teal-100 flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                        <div>
                          <span className="text-charcoal-subtle block text-[10px] uppercase font-semibold">
                            Phone Number
                          </span>
                          <a
                            href={`tel:${booking.student_phone}`}
                            className="font-semibold text-navy hover:underline"
                          >
                            {booking.student_phone || 'Phone unavailable'}
                          </a>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded border border-teal-100 flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                        <div>
                          <span className="text-charcoal-subtle block text-[10px] uppercase font-semibold">
                            Email Address
                          </span>
                          <a
                            href={`mailto:${booking.student_email}`}
                            className="font-semibold text-navy hover:underline truncate block"
                          >
                            {booking.student_email || 'Email unavailable'}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isRejected && (
                  <div className="bg-slate-50 border border-surface-border rounded-md p-3 text-xs text-charcoal-muted">
                    You declined this application.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Inbox}
          title={statusFilter === 'all' ? 'Inbox is empty' : `No ${statusFilter} requests`}
          description={
            statusFilter === 'all'
              ? 'You do not have any incoming room booking requests from students yet.'
              : `There are currently no booking requests with status "${statusFilter}".`
          }
        />
      )}

      <Modal
        isOpen={isDecisionModalOpen}
        onClose={() => setIsDecisionModalOpen(false)}
        title={decisionAction === 'accepted' ? 'Accept Booking Request' : 'Decline Booking Request'}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDecisionModalOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant={decisionAction === 'accepted' ? 'primary' : 'danger'}
              size="sm"
              isLoading={isProcessing}
              onClick={handleExecuteDecision}
            >
              {decisionAction === 'accepted' ? 'Confirm Acceptance' : 'Confirm Decline'}
            </Button>
          </>
        }
      >
        <div className="space-y-2 text-xs text-charcoal-muted leading-relaxed">
          {decisionAction === 'accepted' ? (
            <>
              <p>
                Are you sure you want to <strong>accept</strong> the application from <strong>{selectedBooking?.student_name}</strong>?
              </p>
              <div className="bg-teal-50 border border-teal-200 rounded p-3 text-teal-900 space-y-1">
                <strong>Automated System Updates:</strong>
                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-xs">
                  <li>Room status will change to <strong>Occupied</strong>.</li>
                  <li>Competing pending applications for this room will be auto-declined.</li>
                  <li>Direct phone numbers and emails will be shared mutually.</li>
                </ul>
              </div>
            </>
          ) : (
            <p>
              Are you sure you want to decline this booking application? The student applicant will be notified of your decision.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};
