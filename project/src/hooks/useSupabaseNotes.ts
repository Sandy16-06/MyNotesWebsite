import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Note, Category } from '../types';
import { useAuth } from './useAuth';

const defaultCategories: Omit<Category, 'id'>[] = [
  { name: 'Personal', color: '#3B82F6' },
  { name: 'Work', color: '#10B981' },
  { name: 'Ideas', color: '#F59E0B' },
  { name: 'To Do', color: '#EF4444' },
];

export const useSupabaseNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Load notes and categories when user is authenticated
  useEffect(() => {
    if (user) {
      loadNotesAndCategories();
    } else {
      setNotes([]);
      setCategories([]);
      setLoading(false);
    }
  }, [user]);

  const loadNotesAndCategories = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (categoriesError) throw categoriesError;

      // If no categories exist, create default ones
      if (!categoriesData || categoriesData.length === 0) {
        await createDefaultCategories();
      } else {
        setCategories(categoriesData);
      }

      // Load notes
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (notesError) throw notesError;

      const formattedNotes = notesData.map(note => ({
        ...note,
        createdAt: new Date(note.created_at),
        updatedAt: new Date(note.updated_at),
      }));

      setNotes(formattedNotes);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultCategories = async () => {
    if (!user) return;

    try {
      const categoriesToInsert = defaultCategories.map(cat => ({
        ...cat,
        user_id: user.id,
      }));

      const { data, error } = await supabase
        .from('categories')
        .insert(categoriesToInsert)
        .select();

      if (error) throw error;
      if (data) setCategories(data);
    } catch (error) {
      console.error('Error creating default categories:', error);
    }
  };

  const addNote = async (title: string, content: string, category: string): Promise<Note | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          title,
          content,
          category,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newNote: Note = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      return null;
    }
  };

  const updateNote = async (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notes')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotes(prev => prev.map(note => 
        note.id === id 
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      ));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const addCategory = async (name: string, color: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name,
          color,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => [...prev, data]);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return {
    notes,
    categories,
    loading,
    addNote,
    updateNote,
    deleteNote,
    addCategory,
    refreshData: loadNotesAndCategories,
  };
};