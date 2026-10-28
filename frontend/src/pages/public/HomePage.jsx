import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Building,
  KeyRound,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { roomService } from '../../services/roomService';
import { RoomCard } from '../../components/room/RoomCard';
import { RoomCardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
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
    <div className="space-y-16 pb-20">
      {/* Editorial Hero Section */}
      <section className="bg-white border-b border-warm-border pt-12 pb-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sage text-forest-800 rounded-md text-xs font-bold uppercase tracking-wider border border-sage-300/60">
                <ShieldCheck className="w-4 h-4 text-forest-800" />
                <span>Student Accommodation Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-charcoal tracking-tight leading-[1.1]">
                Find a place that feels like yours.
              </h1>

              <p className="text-base sm:text-lg text-charcoal-muted leading-relaxed max-w-xl">
                Discover rooms that fit your next chapter. Connect with room owners and find a place to call home.
              </p>

              {/* Prominent Location-Based Search */}
              <div className="space-y-3 pt-2">
                <form
                  onSubmit={handleSearchSubmit}
                  className="bg-warm-bg p-2 border border-warm-border rounded-lg shadow-subtle max-w-xl flex flex-col sm:flex-row items-stretch gap-2"
                >
                  <div className="relative flex-1 flex items-center">
                    <MapPin className="w-5 h-5 text-forest-800 absolute left-3 shrink-0" />
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="Enter city, university area, or neighborhood..."
                      className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-warm-border rounded-md text-charcoal placeholder:text-charcoal-muted/60 focus:outline-none focus:ring-2 focus:ring-forest-800 focus:border-forest-800"
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

                {/* Clear indication that users can discover available and occupied listings */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-charcoal-muted">
                  <span className="font-semibold text-charcoal">Browse all listings:</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-forest-800" />
                    <span>Available rooms</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-charcoal-muted" />
                    <span>Occupied rooms (view upcoming vacancies)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Composed Photographic Layout */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Main Architectural / Room Imagery Composition */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 bg-warm-bg border border-warm-border rounded-xl shadow-subtle">
                  <div className="space-y-3 sm:gap-4">
                    <div className="aspect-[4/5] rounded-lg overflow-hidden border border-warm-border bg-warm-muted">
                      <img
                        src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
                        alt="Bright organized student room with desk and window"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3.5 bg-white rounded-lg border border-warm-border">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block mb-0.5">
                        Direct Owner Access
                      </span>
                      <p className="text-xs text-charcoal-muted leading-relaxed">
                        Protected mutual contact unlocked upon accepted request.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 sm:gap-4 pt-6">
                    <div className="p-3.5 bg-sage text-forest-800 rounded-lg border border-sage-300/60">
                      <span className="text-[11px] font-bold uppercase tracking-wider block mb-0.5">
                        Real Availability
                      </span>
                      <p className="text-xs text-forest-900 leading-relaxed">
                        Verified vacancy dates &amp; clear student occupant capacities.
                      </p>
                    </div>
                    <div className="aspect-[4/5] rounded-lg overflow-hidden border border-warm-border bg-warm-muted">
                      <img
                        src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80"
                        alt="Minimal quiet bedroom space with study area"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800 mb-1.5 block">
            Simple Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-2">
            A straightforward accommodation workflow connecting students and room owners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-warm-border rounded-lg p-6 shadow-subtle space-y-3">
            <div className="w-9 h-9 rounded-md bg-sage text-forest-800 flex items-center justify-center font-bold text-sm border border-sage-300/60">
              1
            </div>
            <h3 className="text-base font-bold text-charcoal">
              Explore rooms by location.
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              Search by city, campus area, or neighborhood. Review room photographs, monthly rents, occupant caps, and expected vacancy dates.
            </p>
          </div>

          <div className="bg-white border border-warm-border rounded-lg p-6 shadow-subtle space-y-3">
            <div className="w-9 h-9 rounded-md bg-sage text-forest-800 flex items-center justify-center font-bold text-sm border border-sage-300/60">
              2
            </div>
            <h3 className="text-base font-bold text-charcoal">
              Send a booking request.
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              Submit your booking request directly to the room owner with your verified student profile. No upfront payment required to apply.
            </p>
          </div>

          <div className="bg-white border border-warm-border rounded-lg p-6 shadow-subtle space-y-3">
            <div className="w-9 h-9 rounded-md bg-sage text-forest-800 flex items-center justify-center font-bold text-sm border border-sage-300/60">
              3
            </div>
            <h3 className="text-base font-bold text-charcoal">
              Connect with the owner after the request is accepted.
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              Once the room owner accepts your request, direct phone and email contact details are unlocked so you can coordinate move-in details.
            </p>
          </div>
        </div>
      </section>

      {/* Room Discovery Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-3 border-b border-warm-border">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-800 mb-1 block">
              Recent Listings
            </span>
            <h2 className="text-2xl font-bold text-charcoal tracking-tight">
              Featured Accommodations
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              Browse rooms recently published by registered property owners.
            </p>
          </div>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-forest-800 hover:text-forest-900 transition-colors"
          >
            <span>View All Rooms</span>
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
            description="There are currently no listings published on the platform. Property owners can be the first to list."
            action={
              <Link to={isAuthenticated && isOwner ? '/owner/rooms/new' : '/register'}>
                <Button variant="primary" size="sm">
                  List Your Room
                </Button>
              </Link>
            }
          />
        )}
      </section>

      {/* Owner Call to Action Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-800 text-white rounded-xl p-8 sm:p-12 shadow-elevated grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-sage block">
              For Property Owners
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              List your student room on Roomora.
            </h2>
            <p className="text-xs sm:text-sm text-sage-100 leading-relaxed max-w-xl">
              Publish your room with photos, monthly rent, and vacancy dates. Review verified student applications and manage room availability with zero brokerage overhead.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end justify-center">
            <Link
              to={isAuthenticated && isOwner ? '/owner/rooms/new' : '/register'}
              className="w-full sm:w-auto"
            >
              <Button
                variant="secondary"
                size="lg"
                icon={Building}
                className="w-full sm:w-auto bg-sage text-forest-800 hover:bg-white"
              >
                List Your Room
              </Button>
            </Link>
            <Link
              to="/about"
              className="text-xs font-semibold text-sage-100 hover:text-white transition-colors text-center lg:text-right px-2"
            >
              Learn about owner policies &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
