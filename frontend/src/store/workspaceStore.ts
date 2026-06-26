import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Note {
  id: number;
  title: string;
  content: string;
  folder_id: number | null;
  is_pinned: boolean;
  is_archived: boolean;
  in_trash: boolean;
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: number;
  name: string;
  parent_id: number | null;
  created_at: string;
}

interface WorkspaceState {
  notes: Note[];
  folders: Folder[];
  activeNoteId: number | null;
  isSidebarOpen: boolean;
  setNotes: (notes: Note[]) => void;
  setFolders: (folders: Folder[]) => void;
  setActiveNoteId: (id: number | null) => void;
  toggleSidebar: () => void;
  addNote: (note: Note) => void;
  updateNote: (id: number, updates: Partial<Note>) => void;
  deleteNote: (id: number) => void;
  addFolder: (folder: Folder) => void;
  deleteFolder: (id: number) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      notes: [],
      folders: [],
      activeNoteId: null,
      isSidebarOpen: true,
      setNotes: (notes) => set({ notes }),
      setFolders: (folders) => set({ folders }),
      setActiveNoteId: (activeNoteId) => set({ activeNoteId }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      addNote: (note) => set((state) => ({ 
        notes: [note, ...state.notes] 
      })),
      
      updateNote: (id, updates) => set((state) => ({
        notes: state.notes.map(n => 
          n.id === id ? { ...n, ...updates, updated_at: new Date().toISOString() } : n
        )
      })),
      
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter(n => n.id !== id),
        activeNoteId: state.activeNoteId === id ? null : state.activeNoteId
      })),

      addFolder: (folder) => set((state) => ({
        folders: [...state.folders, folder]
      })),

      deleteFolder: (id) => set((state) => ({
        folders: state.folders.filter(f => f.id !== id),
        notes: state.notes.map(n => n.folder_id === id ? { ...n, folder_id: null } : n)
      }))
    }),
    {
      name: 'workspace-storage',
    }
  )
);
