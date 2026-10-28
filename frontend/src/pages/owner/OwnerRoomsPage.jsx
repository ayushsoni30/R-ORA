import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, PlusCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { roomService } from '../../services/roomService';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../services/api';
import { RoomCard } from '../../components/room/RoomCard';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';

export const OwnerRoomsPage = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOwnerRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await roomService.getOwnerRooms();
      setRooms(data);
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchOwnerRooms();
  }, [fetchOwnerRooms]);

  const handleToggleStatus = async (roomId, targetStatus) => {
    try {
      await roomService.updateRoomStatus(roomId, targetStatus);
      success(`Room marked as ${targetStatus}.`);
      setRooms((prev) =>
        prev.map((r) => (r.id === roomId ? { ...r, status: targetStatus } : r))
      );
    } catch (err) {
      error(getErrorMessage(err));
    }
  };

  const handleEdit = (room) => {
    navigate(`/owner/rooms/${room.id}/edit`, { state: { room } });
  };

  const promptDelete = (roomId) => {
    setDeletingId(roomId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await roomService.deleteRoom(deletingId);
      success('Room listing deleted successfully.');
      setIsDeleteModalOpen(false);
      setDeletingId(null);
      fetchOwnerRooms();
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-5">
        <div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">
            My Property Listings
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Manage your accommodation listings, toggle real-time availability, and update details.
          </p>
        </div>
        <Link to="/owner/rooms/new">
          <Button variant="primary" size="md" icon={PlusCircle}>
            Post New Room
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <p className="text-xs text-charcoal-muted">Loading your property listings...</p>
        </div>
      ) : rooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              isOwnerView={true}
              onToggleStatus={handleToggleStatus}
              onEdit={handleEdit}
              onDelete={promptDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title="No properties listed yet"
          description="You haven't listed any student rooms yet. Click below to add your first property listing."
          action={
            <Link to="/owner/rooms/new">
              <Button variant="primary" size="md" icon={PlusCircle}>
                Post Your First Room
              </Button>
            </Link>
          }
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Room Listing"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleConfirmDelete}
            >
              Yes, Delete Room
            </Button>
          </>
        }
      >
        <div className="space-y-2 text-xs text-charcoal-muted leading-relaxed">
          <p>
            Are you sure you want to permanently delete this room listing?
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded p-2.5 text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Safety Guard:</strong> Rooms with an active accepted student booking cannot be deleted. Any pending requests will be cancelled automatically.
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};
