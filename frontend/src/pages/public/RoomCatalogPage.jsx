import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { roomService } from '../../services/roomService';
import { RoomCard } from '../../components/room/RoomCard';
import { RoomCardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';

export const RoomCatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLocation = searchParams.get('location') || '';

  const [locationInput, setLocationInput] = useState(initialLocation);
  const [activeSearch, setActiveSearch] = useState(initialLocation);
  const [statusFilter, setStatusFilter] = useState('all');
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 12;

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      let data = [];
      const skip = page * PAGE_SIZE;

      if (activeSearch.trim()) {
        data = await roomService.searchRooms(activeSearch.trim(), skip, PAGE_SIZE);
      } else {
        data = await roomService.getRooms(skip, PAGE_SIZE);
      }

      setRooms(data);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
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
      <div className="bg-white border border-surface-border rounded-lg p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">
            Discover Student Rooms
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Browse available and occupied rooms posted by property owners. Search by location to find accommodations near your campus.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-teal-600 absolute left-3 top-3" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Search by location (e.g. University Rd, Sector 62, Metro Station)..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-surface-bg border border-surface-border rounded-md text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
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

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="text-xs text-charcoal-muted font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-2 px-3 bg-surface-bg border border-surface-border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-charcoal font-medium"
            >
              <option value="all">All Rooms</option>
              <option value="available">Available Only</option>
              <option value="occupied">Occupied</option>
            </select>
          </div>
        </div>

        {activeSearch && (
          <div className="flex items-center gap-2 text-xs text-charcoal bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-md w-fit">
            <span>Showing results for location: <strong>{activeSearch}</strong></span>
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-teal-700 hover:text-teal-900 ml-1 font-bold"
            >
              &times;
            </button>
          </div>
        )}
      </div>

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

          <div className="flex items-center justify-between border-t border-surface-border pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous Page
            </Button>
            <span className="text-xs text-charcoal-muted">
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
          title={activeSearch ? `No rooms found matching "${activeSearch}"` : 'No rooms found'}
          description={
            activeSearch
              ? 'Try adjusting your search location or clearing the search to view all available listings.'
              : 'There are currently no listings matching your filter criteria.'
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
