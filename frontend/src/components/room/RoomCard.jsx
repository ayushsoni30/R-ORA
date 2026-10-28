import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Calendar, ArrowRight, BedDouble } from 'lucide-react';
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
    if (list.length === 0) list.push('Study Friendly');
    return list.slice(0, 3);
  };

  const amenities = extractAmenities(room.description);

  return (
    <div className="bg-white border border-surface-border rounded-lg overflow-hidden shadow-card hover:shadow-elevated hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
      <div className="relative aspect-[16/10] bg-navy-50 overflow-hidden select-none border-b border-surface-border">
        {ownerUploadedPhoto && !imgError ? (
          <img
            src={ownerUploadedPhoto}
            alt={room.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-navy-800/60 p-4">
            <BedDouble className="w-10 h-10 mb-1.5 stroke-1 text-slate-400" />
            <span className="text-[11px] font-medium tracking-wide uppercase text-charcoal-muted">
              {ownerUploadedPhoto ? 'Image Unavailable' : 'No Photo Uploaded'}
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3 shadow-subtle">
          <Badge variant={isAvailable ? 'available' : 'occupied'} size="sm">
            {isAvailable ? 'Available' : 'Occupied'}
          </Badge>
        </div>

        <div className="absolute bottom-3 left-3 bg-navy-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 shadow-sm">
          <Users className="w-3 h-3 text-teal-300" />
          <span>Max {room.max_occupants} {room.max_occupants === 1 ? 'student' : 'students'}</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-charcoal text-base line-clamp-1 group-hover:text-teal-600 transition-colors" title={room.title}>
              {room.title}
            </h3>
          </div>

          <div className="flex items-center text-xs text-charcoal-muted gap-1.5 mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate">{room.location}</span>
          </div>

          <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed mb-3">
            {room.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {amenities.map((amenity, i) => (
              <span
                key={i}
                className="text-[10px] font-medium px-2 py-0.5 bg-slate-50 text-charcoal-muted border border-surface-border rounded"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-surface-border">
          {room.expected_vacancy_date && (
            <div className="flex items-center justify-between text-xs text-charcoal-muted">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span className="text-[11px]">Expected Vacancy:</span>
              </div>
              <span className="text-[11px] font-medium text-charcoal">
                {room.expected_vacancy_date}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-lg font-bold text-navy-800">
                ₹{Number(room.monthly_rent).toLocaleString()}
              </span>
              <span className="text-xs text-charcoal-muted ml-1">/ month</span>
            </div>

            {!isOwnerView && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/rooms/${room.id}`}
                  className="text-xs font-medium text-charcoal-muted hover:text-navy-800 py-1.5 px-2 transition-colors"
                >
                  View Details
                </Link>
                {isAvailable ? (
                  <Link
                    to={`/rooms/${room.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded shadow-subtle transition-colors"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : (
                  <span className="text-xs font-medium text-slate-400 py-1.5 px-2 select-none">
                    Occupied
                  </span>
                )}
              </div>
            )}
          </div>

          {isOwnerView && (
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-surface-border">
              <button
                type="button"
                onClick={() => onToggleStatus && onToggleStatus(room.id, isAvailable ? 'occupied' : 'available')}
                className={`text-xs px-2.5 py-1 rounded font-medium border transition-colors ${
                  isAvailable
                    ? 'border-[#0D9876]/40 text-[#0D9876] bg-[#E6F7F2] hover:bg-[#d8f3ec]'
                    : 'border-[#6675A8]/40 text-[#6675A8] bg-[#F0F2FA] hover:bg-[#e4e8f7]'
                }`}
              >
                {isAvailable ? 'Mark as Occupied' : 'Mark as Available'}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onEdit && onEdit(room)}
                  className="text-xs px-2.5 py-1 text-charcoal hover:text-navy-800 border border-surface-border rounded font-medium bg-white hover:bg-surface-hover"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete && onDelete(room.id)}
                  className="text-xs px-2.5 py-1 text-rose-600 hover:text-rose-700 border border-rose-200 rounded font-medium bg-rose-50 hover:bg-rose-100"
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
