import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Calendar, ArrowRight, Home } from 'lucide-react';
import { Badge } from '../common/Badge';

export const RoomCard = ({
  room,
  isOwnerView = false,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const [imgError, setImgError] = useState(false);

  const isAvailable = room.status === 'available';
  const ownerUploadedPhoto = (room.images && room.images.length > 0)
    ? room.images[0]
    : (room.image || null);

  const extractAmenities = (desc = '') => {
    const list = [];
    const lower = desc.toLowerCase();
    if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('internet')) list.push('WiFi');
    if (lower.includes('furnish') || lower.includes('bed') || lower.includes('wardrobe')) list.push('Furnished');
    if (lower.includes('desk') || lower.includes('study') || lower.includes('table')) list.push('Study Desk');
    if (lower.includes('ac') || lower.includes('air condition')) list.push('AC');
    if (lower.includes('bath') || lower.includes('attached')) list.push('Attached Bath');
    if (list.length === 0) list.push('Student Friendly');
    return list.slice(0, 3);
  };

  const amenities = extractAmenities(room.description);

  return (
    <div className="bg-white border border-warm-border rounded-lg overflow-hidden shadow-subtle hover:shadow-card hover:border-charcoal-muted/40 transition-all duration-200 flex flex-col justify-between group">
      {/* Room Image Area */}
      <div className="relative aspect-[16/10] bg-warm-muted overflow-hidden select-none border-b border-warm-border">
        {ownerUploadedPhoto && !imgError ? (
          <img
            src={ownerUploadedPhoto}
            alt={room.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#F3F4F0] text-charcoal-muted p-4">
            <Home className="w-9 h-9 mb-1.5 stroke-[1.5] text-[#9EA7A0]" />
            <span className="text-[11px] font-semibold tracking-wide uppercase text-charcoal-muted">
              {ownerUploadedPhoto ? 'Image Unavailable' : 'No Photo Uploaded'}
            </span>
          </div>
        )}

        {/* Clear occupancy status badge (indicator + text) */}
        <div className="absolute top-3 right-3 shadow-subtle">
          <Badge variant={isAvailable ? 'available' : 'occupied'} size="sm">
            {isAvailable ? 'Available' : 'Occupied'}
          </Badge>
        </div>

        {/* Maximum occupant capacity */}
        {room.max_occupants && (
          <div className="absolute bottom-3 left-3 bg-charcoal/85 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 shadow-sm">
            <Users className="w-3.5 h-3.5 text-sage" />
            <span>Max {room.max_occupants} {room.max_occupants === 1 ? 'student' : 'students'}</span>
          </div>
        )}
      </div>

      {/* Room Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3
              className="font-bold text-charcoal text-base line-clamp-1 group-hover:text-forest-800 transition-colors"
              title={room.title}
            >
              {room.title}
            </h3>
          </div>

          <div className="flex items-center text-xs text-charcoal-muted gap-1.5 mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-forest-800 shrink-0" />
            <span className="truncate">{room.location}</span>
          </div>

          <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed mb-3">
            {room.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {amenities.map((amenity, i) => (
              <span
                key={i}
                className="text-[10px] font-medium px-2 py-0.5 bg-warm-bg text-charcoal-muted border border-warm-border rounded"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Area with Rent & Actions */}
        <div className="space-y-3 pt-3 border-t border-warm-border">
          {room.expected_vacancy_date && (
            <div className="flex items-center justify-between text-xs text-charcoal-muted">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-forest-800" />
                <span className="text-[11px]">Expected Vacancy:</span>
              </div>
              <span className="text-[11px] font-semibold text-charcoal">
                {room.expected_vacancy_date}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-lg font-extrabold text-charcoal">
                ₹{Number(room.monthly_rent).toLocaleString()}
              </span>
              <span className="text-xs text-charcoal-muted ml-1">/ month</span>
            </div>

            {!isOwnerView && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/rooms/${room.id}`}
                  className="text-xs font-semibold text-forest-800 hover:text-forest-900 py-1.5 px-2 transition-colors inline-flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          {isOwnerView && (
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-warm-border">
              <button
                type="button"
                onClick={() => onToggleStatus && onToggleStatus(room.id, isAvailable ? 'occupied' : 'available')}
                className={`text-xs px-2.5 py-1 rounded font-semibold border transition-colors ${
                  isAvailable
                    ? 'border-forest-800/30 text-forest-800 bg-sage hover:bg-sage-200'
                    : 'border-warm-border text-charcoal-muted bg-warm-muted hover:bg-warm-hover'
                }`}
              >
                {isAvailable ? 'Mark Occupied' : 'Mark Available'}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onEdit && onEdit(room)}
                  className="text-xs px-2.5 py-1 text-charcoal hover:text-forest-800 border border-warm-border rounded font-semibold bg-white hover:bg-warm-hover transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete && onDelete(room.id)}
                  className="text-xs px-2.5 py-1 text-rose-700 hover:text-rose-800 border border-rose-200 rounded font-semibold bg-rose-50 hover:bg-rose-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
