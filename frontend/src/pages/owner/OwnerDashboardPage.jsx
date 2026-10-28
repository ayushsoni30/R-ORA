import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  CheckCircle2,
  Home,
  Clock,
  Plus,
  Inbox,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { roomService } from '../../services/roomService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../services/api';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

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
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warm-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-charcoal tracking-tight">
              Property Owner Dashboard
            </h1>
            <Badge variant="owner" size="sm">
              Verified Owner
            </Badge>
          </div>
          <p className="text-xs text-charcoal-muted mt-1">
            Welcome back, {user?.full_name}. Real-time accommodation overview and booking applicant management.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/owner/rooms/new">
            <Button variant="primary" size="md" icon={Plus}>
              List New Room
            </Button>
          </Link>
        </div>
      </div>

      {/* Operational Metrics Cards */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-forest-800" />
          <p className="text-xs text-charcoal-muted">Loading your property metrics...</p>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-warm-border rounded-lg p-5 shadow-subtle space-y-2">
            <div className="flex items-center justify-between text-charcoal-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Total Properties</span>
              <Building className="w-4 h-4 text-forest-800" />
            </div>
            <div className="text-3xl font-extrabold text-charcoal">{stats.total_rooms}</div>
            <p className="text-[11px] text-charcoal-muted">All active room listings</p>
          </div>

          <div className="bg-white border border-warm-border rounded-lg p-5 shadow-subtle space-y-2">
            <div className="flex items-center justify-between text-forest-800">
              <span className="text-xs font-bold uppercase tracking-wider">Available Rooms</span>
              <CheckCircle2 className="w-4 h-4 text-forest-800" />
            </div>
            <div className="text-3xl font-extrabold text-forest-800">{stats.available_rooms}</div>
            <p className="text-[11px] text-charcoal-muted">Accepting student requests</p>
          </div>

          <div className="bg-white border border-warm-border rounded-lg p-5 shadow-subtle space-y-2">
            <div className="flex items-center justify-between text-charcoal-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Occupied</span>
              <Home className="w-4 h-4 text-charcoal-muted" />
            </div>
            <div className="text-3xl font-extrabold text-charcoal">{stats.occupied_rooms}</div>
            <p className="text-[11px] text-charcoal-muted">Currently rented out</p>
          </div>

          <div className="bg-white border border-warm-border rounded-lg p-5 shadow-subtle space-y-2">
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Requests</span>
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-3xl font-extrabold text-amber-800">{stats.pending_requests}</div>
            <p className="text-[11px] text-charcoal-muted">Awaiting your decision</p>
          </div>
        </div>
      ) : null}

      {/* Main Operational Hub Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
        {/* Manage Listings Hub Card */}
        <div className="bg-white border border-warm-border rounded-lg p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-5 h-5 text-forest-800" />
              <h2 className="text-base font-bold text-charcoal">Manage Your Room Listings</h2>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed mb-4">
              Review your listed properties, update room descriptions, edit rent or occupancy caps, and toggle availability between Available and Occupied in real time.
            </p>
          </div>
          <div className="pt-4 border-t border-warm-border flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-muted">
              {stats?.total_rooms || 0} Listed Rooms
            </span>
            <Link to="/owner/rooms">
              <Button variant="secondary" size="sm" icon={ArrowRight}>
                View Listings
              </Button>
            </Link>
          </div>
        </div>

        {/* Manage Requests Inbox Hub Card */}
        <div className="bg-white border border-warm-border rounded-lg p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Inbox className="w-5 h-5 text-forest-800" />
              <h2 className="text-base font-bold text-charcoal">Booking Requests Inbox</h2>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed mb-4">
              Review student applications with applicant names, demographics, and photos. Accepting claims the room, auto-resolves competing requests, and shares mutual contact details.
            </p>
          </div>
          <div className="pt-4 border-t border-warm-border flex items-center justify-between">
            <span className="text-xs font-bold text-forest-800 bg-sage px-2.5 py-0.5 rounded border border-sage-300">
              {stats?.pending_requests || 0} Awaiting Review
            </span>
            <Link to="/owner/bookings">
              <Button variant="primary" size="sm" icon={ArrowRight}>
                Open Inbox
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
