import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  CheckCircle2,
  Shield,
  ArrowRight,
  Building2,
  Lock,
  UserCheck,
  Send,
  BedDouble,
} from 'lucide-react';
import { roomService } from '../../services/roomService';
import { RoomCard } from '../../components/room/RoomCard';
import { RoomCardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const HomePage = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, isOwner } = useAuth();

  useEffect(() => {
    let isMounted = true;
    async function loadFeaturedRooms() {
      try {
        const data = await roomService.getRooms(0, 6);
        if (isMounted) {
          setRooms(data);
        }
      } catch (err) {
        console.error('Failed to load initial rooms:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadFeaturedRooms();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchLocation.trim();
    if (query) {
      navigate(`/rooms?location=${encodeURIComponent(query)}`);
    } else {
      navigate('/rooms');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      <section className="bg-gradient-to-b from-white to-surface-bg border-b border-surface-border py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-navy-50 border border-navy-100 rounded-md text-xs font-semibold text-navy-800 tracking-wide uppercase">
                <Shield className="w-3.5 h-3.5 text-teal-600" />
                <span>Trusted by Students &amp; Property Owners</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-800 tracking-tight leading-tight">
                Find Your Room, Feel at Home.
              </h1>

              <p className="text-base sm:text-lg text-charcoal-muted leading-relaxed max-w-xl">
                Roomora connects students with property owners through transparent listings and straightforward booking requests.
              </p>

              <form
                onSubmit={handleSearchSubmit}
                className="bg-white p-2 border border-surface-border rounded-lg shadow-card max-w-xl flex flex-col sm:flex-row items-stretch gap-2"
              >
                <div className="relative flex-1 flex items-center">
                  <MapPin className="w-5 h-5 text-teal-600 absolute left-3 shrink-0" />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Enter city, university area, or sector..."
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-surface-border rounded-md text-charcoal placeholder:text-charcoal-muted/70 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={Search}
                  className="shrink-0"
                >
                  Search Rooms
                </Button>
              </form>

              <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-medium text-charcoal-muted">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  Direct Owner Listings
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  No Brokerage Fees
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  Protected Mutual Contact
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-xl overflow-hidden border border-surface-border shadow-elevated bg-white p-6 sm:p-8 space-y-6">
                <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-lg p-6 text-white space-y-4 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">
                        Live Student Platform
                      </span>
                    </div>
                    <span className="text-[11px] font-medium bg-white/10 px-2 py-0.5 rounded text-white/80">
                      Fast &amp; Direct
                    </span>
                  </div>

                  <div className="space-y-1 relative z-10 pt-2">
                    <h3 className="text-xl font-bold tracking-tight text-white">
                      Verified Room Accommodations
                    </h3>
                    <p className="text-xs text-navy-200 leading-relaxed">
                      Photos and listings uploaded directly by room owners via Cloudinary storage.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 relative z-10">
                    <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded border border-white/10 flex items-center gap-2 text-xs">
                      <BedDouble className="w-4 h-4 text-teal-300 shrink-0" />
                      <span>Direct Listings</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded border border-white/10 flex items-center gap-2 text-xs">
                      <Shield className="w-4 h-4 text-teal-300 shrink-0" />
                      <span>Zero Broker Fees</span>
                    </div>
                  </div>

                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:16px_16px]" />
                </div>

                <div className="grid grid-cols-3 gap-3 text-center pt-1">
                  <div className="p-3 bg-surface-bg rounded-lg border border-surface-border">
                    <div className="text-base font-bold text-navy-800">100%</div>
                    <div className="text-[10px] text-charcoal-muted uppercase tracking-wider font-semibold mt-0.5">Direct Owner</div>
                  </div>
                  <div className="p-3 bg-surface-bg rounded-lg border border-surface-border">
                    <div className="text-base font-bold text-teal-600">₹0</div>
                    <div className="text-[10px] text-charcoal-muted uppercase tracking-wider font-semibold mt-0.5">Brokerage Fee</div>
                  </div>
                  <div className="p-3 bg-surface-bg rounded-lg border border-surface-border">
                    <div className="text-base font-bold text-navy-800">Real-time</div>
                    <div className="text-[10px] text-charcoal-muted uppercase tracking-wider font-semibold mt-0.5">Availability</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-navy-800 tracking-tight">
              Recently Listed Rooms
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              Live accommodations posted directly by registered property owners.
            </p>
          </div>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <span>View all rooms</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <RoomCardSkeleton />
            <RoomCardSkeleton />
            <RoomCardSkeleton />
          </div>
        ) : rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Rooms Listed Yet"
            description="No student accommodations are currently published on the platform. Property owners can be the first to list."
            actionText="Browse Room Catalog"
            actionLink="/rooms"
          />
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
            How Roomora Works
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-2">
            A transparent 3-step process designed specifically for university students and independent property owners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-surface-border rounded-lg p-6 shadow-card space-y-3">
            <div className="w-10 h-10 rounded-md bg-navy-50 text-navy-800 flex items-center justify-center font-bold text-base">
              1
            </div>
            <h3 className="text-base font-semibold text-navy-800">
              Discover By Location
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Search by city, campus area, or sector. View clear photos, real monthly rent, occupancy caps, and expected vacancy dates.
            </p>
          </div>

          <div className="bg-white border border-surface-border rounded-lg p-6 shadow-card space-y-3">
            <div className="w-10 h-10 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-base">
              2
            </div>
            <h3 className="text-base font-semibold text-navy-800">
              Submit Booking Request
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Send a direct booking application with one click. Owners review student profiles without unwanted spam calls or intermediaries.
            </p>
          </div>

          <div className="bg-white border border-surface-border rounded-lg p-6 shadow-card space-y-3">
            <div className="w-10 h-10 rounded-md bg-navy-50 text-navy-800 flex items-center justify-center font-bold text-base">
              3
            </div>
            <h3 className="text-base font-semibold text-navy-800">
              Connect &amp; Move In
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Once the owner accepts your request, direct phone and email contact are immediately disclosed to coordinate move-in smoothly.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-surface-border py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-800 tracking-tight">
              Why Choose Roomora
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-2">
              Built from the ground up to eliminate the friction, broker commissions, and privacy risks of traditional room rentals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 border border-surface-border rounded-lg bg-surface-bg space-y-2.5">
              <Building2 className="w-6 h-6 text-teal-600" />
              <h4 className="text-sm font-semibold text-navy-800">Direct Owner Listings</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Connect directly with actual room owners. Zero brokers, agents, or hidden administrative fees.
              </p>
            </div>

            <div className="p-5 border border-surface-border rounded-lg bg-surface-bg space-y-2.5">
              <Lock className="w-6 h-6 text-teal-600" />
              <h4 className="text-sm font-semibold text-navy-800">Mutual Contact Protection</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Phone numbers and email addresses remain strictly protected until a booking request is accepted.
              </p>
            </div>

            <div className="p-5 border border-surface-border rounded-lg bg-surface-bg space-y-2.5">
              <UserCheck className="w-6 h-6 text-teal-600" />
              <h4 className="text-sm font-semibold text-navy-800">Student-Centric Discovery</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Listings clearly display maximum occupancy, vacancy dates, and proximity to major universities.
              </p>
            </div>

            <div className="p-5 border border-surface-border rounded-lg bg-surface-bg space-y-2.5">
              <Send className="w-6 h-6 text-teal-600" />
              <h4 className="text-sm font-semibold text-navy-800">Simple Online Requests</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Track pending, accepted, and rejected requests in real-time with full transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-navy-800 text-white rounded-xl p-8 sm:p-10 shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                For University Students
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Looking for a room near your campus?
              </h3>
              <p className="text-xs sm:text-sm text-navy-200 leading-relaxed max-w-md">
                Browse verified rooms with transparent rents, check expected vacancy dates, and send booking requests with zero brokerage fees.
              </p>
            </div>
            <div>
              <Link to="/rooms">
                <Button variant="primary" size="md" icon={ArrowRight}>
                  Explore Available Rooms
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white border border-surface-border rounded-xl p-8 sm:p-10 shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                For Property Owners
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-navy-800">
                Have a student-friendly room or flat?
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed max-w-md">
                Post your accommodation in minutes. Receive and manage verified student booking requests directly with full control over availability.
              </p>
            </div>
            <div>
              <Link to={isAuthenticated && isOwner ? '/owner/rooms/new' : '/register'}>
                <Button variant="secondary" size="md" icon={Building2}>
                  List Your Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
