import { useWorkspaceStore } from '@/store/workspaceStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { 
  Folder, 
  FileText, 
  Settings, 
  LogOut, 
  Plus, 
  ChevronRight, 
  ChevronDown, 
  PanelLeftClose, 
  Search,
  Star,
  Trash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar, folders, notes, activeNoteId, setActiveNoteId } = useWorkspaceStore();
  const { signOut, user } = useAuthStore();
  const navigate = useNavigate();
  
  const [expandedFolders, setExpandedFolders] = useState<Record<number, boolean>>({});

  const toggleFolder = (id: number) => {
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const rootFolders = folders.filter(f => !f.parent_id);
  const rootNotes = notes.filter(n => !n.folder_id && !n.in_trash);

  return (
    <AnimatePresence initial={false}>
      {isSidebarOpen && (
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed left-0 top-0 bottom-0 w-64 bg-secondary/30 border-r backdrop-blur-xl flex flex-col z-20"
        >
          {/* Header */}
          <div className="h-14 flex items-center justify-between px-4 border-b">
            <div className="flex items-center gap-2 font-semibold">
              <div className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs">
                {user?.email?.[0].toUpperCase() || 'M'}
              </div>
              <span>MyNotes</span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>

          {/* Actions */}
          <div className="p-3 flex flex-col gap-1">
            <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>

          {/* Quick Links */}
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Library
          </div>
          <div className="px-3 flex flex-col gap-1">
            <Button variant="ghost" size="sm" className="justify-start h-8">
              <Star className="h-3.5 w-3.5 mr-2" /> Favorites
            </Button>
            <Button variant="ghost" size="sm" className="justify-start h-8">
              <Trash className="h-3.5 w-3.5 mr-2" /> Trash
            </Button>
          </div>

          {/* Workspace */}
          <div className="flex-1 overflow-y-auto py-2">
            <div className="px-3 py-2 flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider group">
              <span>Workspace</span>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="px-2 flex flex-col gap-0.5">
              {rootFolders.map(folder => (
                <div key={folder.id} className="flex flex-col">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start h-8 px-2"
                    onClick={() => toggleFolder(folder.id)}
                  >
                    {expandedFolders[folder.id] ? (
                      <ChevronDown className="h-3.5 w-3.5 mr-1" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 mr-1" />
                    )}
                    <Folder className="h-3.5 w-3.5 mr-2 fill-muted-foreground/30 text-muted-foreground" />
                    <span className="truncate">{folder.name}</span>
                  </Button>
                  {/* Recursively rendering subfolders is skipped for simplicity in this prototype */}
                </div>
              ))}
              
              {rootNotes.map(note => (
                <Button 
                  key={note.id}
                  variant={activeNoteId === note.id ? "secondary" : "ghost"} 
                  size="sm" 
                  className="justify-start h-8 px-2 ml-4"
                  onClick={() => {
                    setActiveNoteId(note.id);
                    navigate(`/app/notes/${note.id}`);
                  }}
                >
                  <FileText className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span className="truncate">{note.title || 'Untitled'}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
