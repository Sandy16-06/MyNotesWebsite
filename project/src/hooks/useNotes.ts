import { useState, useEffect } from 'react';
import { Note, Category } from '../types';

const STORAGE_KEY = 'notes-app-data';

const defaultCategories: Category[] = [
  { id: 'personal', name: 'Personal', color: '#3B82F6' },
  { id: 'work', name: 'Work', color: '#10B981' },
  { id: 'ideas', name: 'Ideas', color: '#F59E0B' },
  { id: 'todo', name: 'To Do', color: '#EF4444' },
];

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const { notes: savedNotes, categories: savedCategories } = JSON.parse(savedData);
        setNotes(savedNotes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        })));
        setCategories(savedCategories);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever notes or categories change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes, categories }));
  }, [notes, categories]);

  const addNote = (title: string, content: string, category: string): Note => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const addCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      color,
    };
    setCategories(prev => [...prev, newCategory]);
  };

  return {
    notes,
    categories,
    loading: false,
    addNote,
    updateNote,
    deleteNote,
    addCategory,
    refreshData: () => {},
  };
};