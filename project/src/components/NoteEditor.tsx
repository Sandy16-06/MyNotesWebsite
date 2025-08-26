import React, { useState, useEffect } from 'react';
import { Save, X, Edit3, Calendar, Tag } from 'lucide-react';
import { Note, Category } from '../types';

interface NoteEditorProps {
  note: Note;
  categories: Category[];
  isEditing: boolean;
  onEdit: () => void;
  onSave: (title: string, content: string, category: string) => void;
  onCancel: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  categories,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [category, setCategory] = useState(note.category);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
  }, [note]);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim(), content, category);
    }
  };

  const handleCancel = () => {
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    onCancel();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const selectedCategory = categories.find(cat => cat.id === category);

  return (
    <div className="h-full flex flex-col scale-in">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-white/60" />
            <span className="text-sm text-white/80">
              Last updated: {formatDate(note.updatedAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-all hover-lift ripple"
                >
                  <X size={20} />
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 btn-gradient rounded-lg flex items-center gap-2 ripple"
                >
                  <Save size={20} />
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={onEdit}
                className="px-4 py-2 rounded-lg flex items-center gap-2 ripple"
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
                }}
              >
                <Edit3 size={20} />
                Edit
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold border-none outline-none focus:ring-0 bg-transparent text-white placeholder-white/60"
              placeholder="Note title..."
            />
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-white/60" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-1 bg-white/20 border border-white/30 rounded-lg focus-ring text-white backdrop-blur-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-white" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)', color: 'white' }}>{note.title}</h1>
            {selectedCategory && (
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-white/60" />
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm"
                  style={{
                    backgroundColor: selectedCategory.color + '40',
                    color: 'white',
                    border: `1px solid ${selectedCategory.color}60`,
                  }}
                >
                  {selectedCategory.name}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full border-none outline-none resize-none focus:ring-0 bg-transparent text-white/90 leading-relaxed placeholder-white/60"
            placeholder="Start writing your note..."
          />
        ) : (
          <div className="h-full overflow-y-auto">
            <div className="prose max-w-none text-white/90 leading-relaxed whitespace-pre-wrap">
              {note.content || (
                <span className="text-white/60 italic">This note is empty. Click Edit to add content.</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};