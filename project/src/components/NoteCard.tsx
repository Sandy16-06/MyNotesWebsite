import React from 'react';
import { Edit3, Trash2, Calendar, Tag, AlertTriangle } from 'lucide-react';
import { Note, Category } from '../types';

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPermanentDelete: () => void;
  categories: Category[];
  className?: string;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onPermanentDelete,
  categories,
  className = '',
}) => {
  const category = categories.find(cat => cat.id === note.category);
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      className={`p-4 border border-white/20 rounded-lg cursor-pointer card-hover hover-lift ${
        isSelected 
          ? 'bg-white/30 border-blue-400/50 shadow-lg backdrop-blur-sm' 
          : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
      } ${className}`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-white truncate flex-1" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)', color: 'white' }}>
          {note.title}
        </h3>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 transition-all hover:scale-110 ripple"
            style={{ 
              color: 'white', 
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '4px'
            }}
            title="Edit note"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 transition-all hover:scale-110 ripple"
            style={{ 
              color: 'white', 
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '4px'
            }}
            title="Delete note"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPermanentDelete();
            }}
            className="p-1 transition-all hover:scale-110 ripple"
            style={{ 
              color: 'white', 
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
              backgroundColor: 'rgba(220, 38, 38, 0.4)',
              borderRadius: '4px',
              border: '1px solid rgba(220, 38, 38, 0.6)'
            }}
            title="Permanent Delete"
          >
            <AlertTriangle size={16} />
          </button>
        </div>
      </div>

      <p className="text-sm text-white/80 mb-3 line-clamp-2">
        {note.content || 'No content'}
      </p>

      <div className="flex items-center justify-between text-xs text-white/60">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{formatDate(note.updatedAt)}</span>
        </div>
        {category && (
          <div className="flex items-center gap-1">
            <Tag size={12} />
            <span
              className="px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
              style={{
                backgroundColor: category.color + '40',
                color: 'white',
                border: `1px solid ${category.color}60`,
              }}
            >
              {category.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};