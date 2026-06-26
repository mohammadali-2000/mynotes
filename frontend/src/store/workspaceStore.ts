import { create } from 'zustand';

export interface Folder {
  id: number;
  user_id: string;
  parent_id: number | null;
  name: string;
  position: number;
  created_at: string;
}

export interface Note {
  id: number;
  user_id: string;
  folder_id: number | null;
  title: string;
  content: string;
  is_pinned: boolean;
  is_archived: boolean;
  in_trash: boolean;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
}

export interface Tag {
  id: number;
  name: string;
}

interface WorkspaceState {
  folders: Folder[];
  notes: Note[];
  activeNoteId: number | null;
  isSidebarOpen: boolean;
  setFolders: (folders: Folder[]) => void;
  setNotes: (notes: Note[]) => void;
  setActiveNoteId: (id: number | null) => void;
  toggleSidebar: () => void;
  addFolder: (folder: Folder) => void;
  updateFolder: (id: number, updates: Partial<Folder>) => void;
  deleteFolder: (id: number) => void;
  addNote: (note: Note) => void;
  updateNote: (id: number, updates: Partial<Note>) => void;
  deleteNote: (id: number) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  folders: [],
  notes: [],
  activeNoteId: null,
  isSidebarOpen: true,
  setFolders: (folders) => set({ folders }),
  setNotes: (notes) => set({ notes }),
  setActiveNoteId: (activeNoteId) => set({ activeNoteId }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  addFolder: (folder) => set((state) => ({ folders: [...state.folders, folder] })),
  updateFolder: (id, updates) => set((state) => ({
    folders: state.folders.map(f => f.id === id ? { ...f, ...updates } : f)
  })),
  deleteFolder: (id) => set((state) => ({
    folders: state.folders.filter(f => f.id !== id)
  })),
  
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (id, updates) => set((state) => ({
    notes: state.notes.map(n => n.id === id ? { ...n, ...updates } : n)
  })),
  deleteNote: (id) => set((state) => ({
    notes: state.notes.filter(n => n.id !== id),
    activeNoteId: state.activeNoteId === id ? null : state.activeNoteId
  })),
}));
