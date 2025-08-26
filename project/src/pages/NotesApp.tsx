import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2, Tag, Calendar, Download, BookOpen, Filter, LogIn, Image, Upload } from 'lucide-react';
import { NoteEditor } from '../components/NoteEditor';
import { NoteCard } from '../components/NoteCard';
import { Sidebar } from '../components/Sidebar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { AuthModal } from '../components/AuthModal';
import { UserMenu } from '../components/UserMenu';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ImageUpload } from '../components/ImageUpload';
import { useAuth } from '../hooks/useAuth';
import { useSupabaseNotes } from '../hooks/useSupabaseNotes';
import { useNotes } from '../hooks/useNotes';
import { Note, Category } from '../types';

export const NotesApp: React.FC = () => {
  // For demo purposes, get user from localStorage
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const localNotes = useNotes();
  
  // Always use local storage for demo
  const { notes, categories, addNote, updateNote, deleteNote, addCategory, loading: notesLoading } = localNotes;

  useEffect(() => {
    const storedUser = localStorage.getItem('demo-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setAuthLoading(false);
  }, []);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [notes, searchTerm, selectedCategory]);

  const handleNewNote = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    
    // Create a new note with default values and open it for editing
    const title = `Note ${notes.length + 1}`;
    const content = '';
    const category = selectedCategory === 'all' ? (categories[0]?.id || 'personal') : selectedCategory;
    
    if (user) {
      // For Supabase notes, addNote is async
      addNote(title, content, category).then((newNote) => {
        if (newNote) {
          setSelectedNote(newNote);
          setIsEditing(true); // Auto-edit the new note
        }
      });
    } else {
      // For local notes, addNote is sync
      const newNote = addNote(title, content, category);
      setSelectedNote(newNote);
      setIsEditing(true); // Auto-edit the new note
    }
  };

  const handleCreateNote = (title: string, content: string, category: string) => {
    if (user) {
      // For Supabase notes, addNote is async
      addNote(title, content, category).then((newNote) => {
        if (newNote) {
          setSelectedNote(newNote);
          setIsEditing(false); // Don't auto-edit since we already have content
        }
      });
    } else {
      // For local notes, addNote is sync
      const newNote = addNote(title, content, category);
      setSelectedNote(newNote);
      setIsEditing(false); // Don't auto-edit since we already have content
    }
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(true);
  };

  const handleSaveNote = (title: string, content: string, category: string) => {
    if (selectedNote) {
      updateNote(selectedNote.id, { title, content, category });
      setSelectedNote({ ...selectedNote, title, content, category });
    }
    setIsEditing(false);
  };

  const handleDeleteNote = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      setConfirmDialog({
        isOpen: true,
        title: 'Delete Note',
        message: `Are you sure you want to delete "${note.title}"? This action can be undone.`,
        onConfirm: () => {
          deleteNote(id);
          if (selectedNote?.id === id) {
            setSelectedNote(null);
          }
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        },
        type: 'warning',
      });
    }
  };

  const handlePermanentDeleteNote = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      setConfirmDialog({
        isOpen: true,
        title: 'Permanent Delete',
        message: `Are you sure you want to PERMANENTLY delete "${note.title}"? This action cannot be undone and the note will be lost forever.`,
        onConfirm: () => {
          deleteNote(id);
          if (selectedNote?.id === id) {
            setSelectedNote(null);
          }
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        },
        type: 'danger',
      });
    }
  };

  const handleExportNotes = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    const dataStr = JSON.stringify(notes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'my-notes.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImageUpload = (imageUrl: string) => {
    if (selectedNote && isEditing) {
      const imageMarkdown = `\n\n![Uploaded Image](${imageUrl})\n\n`;
      const updatedContent = selectedNote.content + imageMarkdown;
      setSelectedNote({ ...selectedNote, content: updatedContent });
    }
    setShowImageUpload(false);
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        <div className="text-center">
          <LoadingSpinner size={48} className="mb-4" />
          <p className="text-white/80 text-lg">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen relative">
      {/* Animated Background Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Sidebar */}
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        onAddCategory={addCategory}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row backdrop-blur-glass">
        {/* Notes List */}
        <div className="w-full lg:w-1/3 border-r border-white/20 glass-effect slide-in-up">
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold flex items-center gap-2 float-animation" style={{ 
                color: 'white', 
                textShadow: '0 3px 6px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 255, 255, 0.3)',
                fontWeight: '800'
              }}>
                <BookOpen className="text-white" size={28} style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))' }} />
                <span>My Notes</span>
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportNotes}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-all hover-lift ripple"
                  title="Export Notes"
                >
                  <Download size={20} />
                </button>
                {user ? (
                  <UserMenu user={user} onSignOut={() => {
                    localStorage.removeItem('demo-user');
                    window.location.reload();
                  }} />
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover-lift ripple"
                    style={{
                      background: 'rgba(59, 130, 246, 0.8)',
                      color: 'white',
                      border: '1px solid rgba(59, 130, 246, 1)',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
                    }}
                  >
                    <LogIn size={18} />
                    <span className="text-sm font-medium">Sign In</span>
                  </button>
                )}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-all hover-lift ripple lg:hidden"
                  title="Toggle Sidebar"
                >
                  <Filter size={20} />
                </button>
              </div>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg focus-ring text-white placeholder-white/60 backdrop-blur-sm"
              />
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={handleNewNote}
                className="flex-1 flex items-center justify-center gap-2 btn-gradient py-3 px-4 rounded-lg font-medium ripple"
              >
                <Plus size={20} />
                New Note
              </button>
              {isEditing && selectedNote && (
                <button
                  onClick={() => setShowImageUpload(true)}
                  className="p-3 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-all hover-lift ripple"
                  title="Add Image"
                >
                  <Image size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {notesLoading ? (
              <div className="p-8 text-center">
                <LoadingSpinner size={32} className="mb-4" />
                <p className="text-white/70">Loading notes...</p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="p-8 text-center text-white/70 scale-in">
                <BookOpen size={48} className="mx-auto mb-4 text-white/40 float-animation" />
                <p className="text-lg mb-2 text-shadow">
                  {user ? 'No notes found' : 'Welcome to My Notes'}
                </p>
                <p className="text-sm text-white/60">
                  {user ? 'Create your first note to get started' : 'Sign in to sync your notes across devices'}
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {filteredNotes.map((note, index) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isSelected={selectedNote?.id === note.id}
                    onSelect={() => setSelectedNote(note)}
                    onEdit={() => handleEditNote(note)}
                    onDelete={() => handleDeleteNote(note.id)}
                    onPermanentDelete={() => handlePermanentDeleteNote(note.id)}
                    categories={categories}
                    className={`stagger-${Math.min(index + 1, 5)} text-reveal`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Note Editor */}
        <div className="flex-1 glass-effect">
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              categories={categories}
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onSave={handleSaveNote}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-white/70">
              <div className="text-center scale-in">
                <Edit3 size={64} className="mx-auto mb-4 text-white/40 float-animation morphing-shape" />
                <p className="text-xl mb-2 gradient-text text-shadow">Select a note to start editing</p>
                <p className="text-sm text-white/60">Choose a note from the list or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.type === 'danger' ? 'Delete Forever' : 'Delete'}
        cancelText="Cancel"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        type={confirmDialog.type}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <ImageUpload
        isOpen={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onUpload={handleImageUpload}
      />
    </div>
  );
};