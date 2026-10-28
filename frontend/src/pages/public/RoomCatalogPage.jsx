import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, X, AlertCircle } from 'lucide-react';
import { roomService } from '../../services/roomService';
import { RoomCard } from '../../components/room/RoomCard';
import { RoomCardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const RoomCatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLocation = searchParams.get('location') || '';

  const [locationInput, setLocationInput] = useState(initialLocation);
  const [activeSearch, setActiveSearch] = useState(initialLocation);
  const [statusFilter, setStatusFilter] = useState('all');
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 12;

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setErrorState(null);
    try {
      let data = [];
      const skip = page * PAGE_SIZE;

      if (activeSearch.trim()) {
        data = await roomService.searchRooms(activeSearch.trim(), skip, PAGE_SIZE);
      } else {
        data = await roomService.getRooms(skip, PAGE_SIZE);
      }

      setRooms(data || []);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
      setErrorState('Unable to load rooms at this time. Please check your connection or retry.');
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeSearch, page]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = locationInput.trim();
    setActiveSearch(query);
    setPage(0);
    if (query) {
      setSearchParams({ location: query });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setLocationInput('');
    setActiveSearch('');
    setPage(0);
    setSearchParams({});
  };

  const filteredRooms = rooms.filter((room) => {
    if (statusFilter === 'all') return true;
    return room.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Location Search Surface */}
      <div className="bg-white border border-warm-border rounded-lg p-6 shadow-subtle space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800 block mb-1">
            Student Accommodations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Find Rooms by Location
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1 leading-relaxed">
            Search student accommodations across university areas and sectors. Both available listings and occupied rooms with upcoming vacancy dates are displayed.
          </p>
        </div>

        {/* Location search bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch pt-1">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-forest-800 absolute left-3 top-3" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Search by location (e.g. University Rd, Sector 62, North Campus)..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-warm-bg border border-warm-border rounded-md text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-800 focus:border-forest-800"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" variant="primary" size="md" icon={Search} className="flex-1 sm:flex-none">
                Search
              </Button>
              {activeSearch && (
                <Button type="button" variant="outline" size="md" onClick={handleClearSearch}>
                  Clear
                </Button>
              )}
            </div>
          </form>

          {/* Quick status filter selector */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="text-xs text-charcoal-muted font-semibold">Availability:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-2 px-3 bg-warm-bg border border-warm-border rounded-md focus:outline-none focus:ring-2 focus:ring-forest-800 text-charcoal font-semibold"
            >
              <option value="all">All Listings</option>
              <option value="available">Available Only</option>
              <option value="occupied">Occupied Only</option>
            </select>
          </div>
        </div>

        {/* Result summary bar & Active query badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-warm-border text-xs text-charcoal-muted">
          <div className="flex items-center gap-2">
            {!isLoading && (
              <span className="font-semibold text-charcoal">
                Showing {filteredRooms.length} {filteredRooms.length === 1 ? 'room listing' : 'room listings'}
              </span>
            )}
            {activeSearch && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-sage text-forest-800 rounded font-semibold text-xs border border-sage-300">
                <span>Location: {activeSearch}</span>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="hover:text-forest-950 p-0.5"
                  aria-label="Remove search filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-forest-800" />
              <span>Available</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-charcoal-muted" />
              <span>Occupied</span>
            </span>
          </div>
        </div>
      </div>

      {/* Error state */}
      {errorState && (
        <div className="bg-rose-50 border border-rose-200 rounded-md p-4 flex items-center justify-between gap-3 text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorState}</span>
          </div>
          <Button variant="danger-outline" size="sm" onClick={fetchRooms}>
            Retry
          </Button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <RoomCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredRooms.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between border-t border-warm-border pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous Page
            </Button>
            <span className="text-xs font-semibold text-charcoal-muted">
              Page {page + 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={rooms.length < PAGE_SIZE}
              onClick={() => setPage((p) => p + 1)}
            >
              Next Page
            </Button>
          </div>
        </div>
      ) : (
        <EmptyState
          title={activeSearch ? `No rooms found matching "${activeSearch}"` : 'No rooms listed yet'}
          description={
            activeSearch
              ? 'Try searching with a broader location name or clear the search to view all student accommodations.'
              : 'There are currently no room listings matching your filter criteria.'
          }
          action={
            activeSearch ? (
              <Button variant="outline" size="sm" onClick={handleClearSearch}>
                View All Rooms
              </Button>
            ) : null
          }
        />
      )}
    </div>
  );
};
