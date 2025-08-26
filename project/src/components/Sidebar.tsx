import React, { useState } from 'react';
import { Plus, Tag, X, Check, Folder, Hash } from 'lucide-react';
import { Category } from '../types';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  onAddCategory: (name: string, color: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const predefinedColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#06B6D4', '#84CC16', '#F97316',
  '#EC4899', '#6B7280'
];

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  onAddCategory,
  isOpen,
  onToggle,
}) => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0]);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim(), selectedColor);
      setNewCategoryName('');
      setSelectedColor(predefinedColors[0]);
      setIsAddingCategory(false);
    }
  };

  const handleCancel = () => {
    setNewCategoryName('');
    setSelectedColor(predefinedColors[0]);
    setIsAddingCategory(false);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 glass-effect border-r border-white/20 transform transition-all duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)', color: 'white' }}>
              <Folder size={20} />
              Categories
            </h2>
            <button
              onClick={onToggle}
              className="p-1 text-white/60 hover:text-white lg:hidden transition-all hover:scale-110 ripple"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-2">
            <button
              onClick={() => onCategorySelect('all')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-white/30 text-white font-medium backdrop-blur-sm border border-blue-400/50'
                  : 'text-white/80 hover:bg-white/20'
              }`}
            >
              <Hash size={18} />
              All Notes
            </button>
            
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all hover-lift ${
                  selectedCategory === category.id
                    ? 'bg-white/30 text-white font-medium backdrop-blur-sm border border-blue-400/50'
                    : 'text-white/80 hover:bg-white/20'
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full border border-white/30 shadow-lg"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/20">
            {isAddingCategory ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name..."
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg focus-ring text-white placeholder-white/60 backdrop-blur-sm"
                  autoFocus
                />
                <div className="flex flex-wrap gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                        selectedColor === color ? 'border-white shadow-lg' : 'border-white/40'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-3 py-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-all ripple"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCategory}
                    className="flex-1 px-3 py-2 btn-gradient rounded-lg flex items-center justify-center gap-2 ripple"
                  >
                    <Check size={16} />
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingCategory(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-all hover-lift ripple"
              >
                <Plus size={18} />
                Add Category
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};