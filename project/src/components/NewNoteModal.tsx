import React, { useState } from 'react';
import { X, Plus, Tag, Type, FileText, Calendar } from 'lucide-react';
import { Category } from '../types';

interface NewNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNote: (title: string, content: string, category: string) => void;
  categories: Category[];
  selectedCategory?: string;
}

export const NewNoteModal: React.FC<NewNoteModalProps> = ({
  isOpen,
  onClose,
  onCreateNote,
  categories,
  selectedCategory = 'all'
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(
    selectedCategory === 'all' ? (categories[0]?.id || 'personal') : selectedCategory
  );
  const [template, setTemplate] = useState('blank');

  if (!isOpen) return null;

  const templates = [
    {
      id: 'blank',
      name: 'Blank Note',
      icon: FileText,
      content: ''
    },
    {
      id: 'meeting',
      name: 'Meeting Notes',
      icon: Calendar,
      content: `# Meeting Notes

**Date:** ${new Date().toLocaleDateString()}
**Attendees:** 
**Agenda:**

## Discussion Points
- 

## Action Items
- [ ] 
- [ ] 

## Next Steps
`
    },
    {
      id: 'todo',
      name: 'To-Do List',
      icon: Tag,
      content: `# To-Do List

**Priority Tasks:**
- [ ] 
- [ ] 
- [ ] 

**Later:**
- [ ] 
- [ ] 

**Completed:**
- [x] 
`
    },
    {
      id: 'journal',
      name: 'Daily Journal',
      icon: Type,
      content: `# Daily Journal - ${new Date().toLocaleDateString()}

## How I'm Feeling


## What Happened Today
- 
- 
- 

## Grateful For
- 
- 
- 

## Tomorrow's Goals
- 
- 
`
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const selectedTemplate = templates.find(t => t.id === template);
      const noteContent = selectedTemplate?.content || '';
      onCreateNote(title.trim(), noteContent, category);
      
      // Form will be reset when modal reopens
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setTemplate(templateId);
  };

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTitle('');
      setContent('');
      setCategory(selectedCategory === 'all' ? (categories[0]?.id || 'personal') : selectedCategory);
      setTemplate('blank');
    }
  }, [isOpen, selectedCategory, categories]);

  // Close modal after successful creation
  const handleCreateAndClose = (e: React.FormEvent) => {
    handleSubmit(e);
    onClose();
  };

  const selectedCategoryObj = categories.find(cat => cat.id === category);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto scale-in"
        style={{ boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Plus 
              size={24} 
              style={{ color: '#3B82F6', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
            />
            <h2 
              className="text-xl font-bold"
              style={{ color: 'white', textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
            >
              Create New Note
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 transition-all hover:scale-110 ripple"
            style={{ 
              color: 'white', 
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Note Title */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
              <Type size={16} />
              Note Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus-ring text-white placeholder-white/60 backdrop-blur-sm text-lg font-medium"
              placeholder="Enter note title..."
              required
              autoFocus
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
              <Tag size={16} />
              Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus-ring text-white backdrop-blur-sm appearance-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-gray-800 text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
              {selectedCategoryObj && (
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full border border-white/30"
                    style={{ backgroundColor: selectedCategoryObj.color }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-3">
              Choose Template
            </label>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleTemplateChange(tmpl.id)}
                  className={`p-4 rounded-lg border transition-all hover-lift ${
                    template === tmpl.id
                      ? 'bg-blue-500/30 border-blue-400/50 text-white'
                      : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <tmpl.icon size={24} className="mx-auto mb-2" />
                  <p className="text-sm font-medium">{tmpl.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg transition-all hover-lift ripple"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-lg font-medium transition-all hover-lift ripple flex items-center justify-center gap-2"
              style={{
                background: 'rgba(59, 130, 246, 0.8)',
                color: 'white',
                border: '1px solid rgba(59, 130, 246, 1)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
              }}
            >
              <Plus size={20} />
              Create Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};