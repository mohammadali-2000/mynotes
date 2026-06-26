import { useWorkspaceStore } from '@/store/workspaceStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { FileText, LogOut, PlusCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const { notes, addNote, activeNoteId } = useWorkspaceStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleCreateNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      folder_id: null,
      is_pinned: false,
      is_archived: false,
      in_trash: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    addNote(newNote);
    navigate(`/app/notes/${newNote.id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 h-full border-r bg-card flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <span className="font-semibold text-lg">MyNotes Demo</span>
      </div>

      <div className="p-4">
        <Button onClick={handleCreateNote} className="w-full justify-start gap-2">
          <PlusCircle className="h-4 w-4" />
          New Note
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
          All Notes
        </div>
        <div className="space-y-1">
          {notes.map(note => (
            <Link
              key={note.id}
              to={`/app/notes/${note.id}`}
              className={`flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors ${
                activeNoteId === note.id ? 'bg-secondary text-secondary-foreground font-medium' : 'hover:bg-muted/50 text-muted-foreground'
              }`}
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span className="truncate">{note.title || 'Untitled'}</span>
            </Link>
          ))}
          {notes.length === 0 && (
            <div className="px-2 py-4 text-sm text-muted-foreground italic text-center">
              No notes yet
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center text-primary font-bold">
              {user?.user_metadata?.full_name?.charAt(0) || 'U'}
            </div>
            <span className="text-sm font-medium truncate">{user?.user_metadata?.full_name || 'User'}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Log out">
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
}
