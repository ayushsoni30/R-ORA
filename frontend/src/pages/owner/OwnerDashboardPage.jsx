import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle,
  Home,
  Clock,
  PlusCircle,
  Inbox,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { roomService } from '../../services/roomService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../services/api';
import { Button } from '../../components/common/Button';

export const OwnerDashboardPage = () => {
  const { user } = useAuth();
  const { error } = useToast();

  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const data = await roomService.getOwnerDashboard();
        if (isMounted) setStats(data);
      } catch (err) {
        if (isMounted) error(getErrorMessage(err));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadStats();
    return () => {
      isMounted = false;
    };
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-5">
        <div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">
            Owner Dashboard
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Welcome back, {user?.full_name}. Real-time overview of your student accommodations and applicant reviews.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/owner/rooms/new">
            <Button variant="primary" size="md" icon={PlusCircle}>
              Post New Room
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <p className="text-xs text-charcoal-muted">Loading your property metrics...</p>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Rooms */}
          <div className="bg-white border border-surface-border rounded-lg p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-charcoal-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Properties</span>
              <Building2 className="w-4 h-4 text-navy-600" />
            </div>
            <div className="text-3xl font-bold text-navy">{stats.total_rooms}</div>
            <p className="text-[11px] text-charcoal-muted">All registered accommodations</p>
          </div>

          {/* Available Rooms */}
          <div className="bg-white border border-surface-border rounded-lg p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-teal-600">
              <span className="text-xs font-semibold uppercase tracking-wider">Available Rooms</span>
              <CheckCircle className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-3xl font-bold text-teal-700">{stats.available_rooms}</div>
            <p className="text-[11px] text-charcoal-muted">Accepting student requests</p>
          </div>

          {/* Occupied Rooms */}
          <div className="bg-white border border-surface-border rounded-lg p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-charcoal-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">Occupied</span>
              <Home className="w-4 h-4 text-charcoal-muted" />
            </div>
            <div className="text-3xl font-bold text-charcoal">{stats.occupied_rooms}</div>
            <p className="text-[11px] text-charcoal-muted">Rented to students</p>
          </div>

          {/* Pending Requests */}
          <div className="bg-white border border-surface-border rounded-lg p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-amber-600">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending Requests</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-bold text-amber-700">{stats.pending_requests}</div>
            <p className="text-[11px] text-charcoal-muted">Awaiting your approval</p>
          </div>
        </div>
      ) : null}

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Manage Listings Panel */}
        <div className="bg-white border border-surface-border rounded-lg p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-navy-700" />
              <h2 className="text-base font-bold text-navy">Manage Your Listings</h2>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed mb-4">
              Review your listed properties, update room information, and toggle availability between Available and Occupied in real time.
            </p>
          </div>
          <div className="pt-4 border-t border-surface-border flex items-center justify-between">
            <span className="text-xs font-medium text-charcoal-muted">
              {stats?.total_rooms || 0} Listed Properties
            </span>
            <Link to="/owner/rooms">
              <Button variant="outline" size="sm" icon={ArrowRight}>
                View Listings
              </Button>
            </Link>
          </div>
        </div>

        {/* Booking Requests Inbox Panel */}
        <div className="bg-white border border-surface-border rounded-lg p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Inbox className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold text-navy">Booking Requests Inbox</h2>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed mb-4">
              Review incoming student applications with student name, gender, age, and photo. Accepting claims the room and reveals mutual contact details.
            </p>
          </div>
          <div className="pt-4 border-t border-surface-border flex items-center justify-between">
            <span className="text-xs font-medium text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
              {stats?.pending_requests || 0} Pending Reviews
            </span>
            <Link to="/owner/bookings">
              <Button variant="primary" size="sm" icon={ArrowRight}>
                Review Requests
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
