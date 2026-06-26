import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useWorkspaceStore } from '@/store/workspaceStore';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Star, MoreHorizontal, FileDown } from 'lucide-react';
import { api } from '@/lib/api';

export default function NotesWorkspace() {
  const { noteId } = useParams();
  const { notes, activeNoteId, setActiveNoteId, updateNote, addNote } = useWorkspaceStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const activeNote = notes.find(n => n.id === Number(noteId));

  useEffect(() => {
    if (noteId && activeNote) {
      setActiveNoteId(Number(noteId));
      setTitle(activeNote.title || '');
      setContent(activeNote.content || '');
    } else if (!noteId) {
      setActiveNoteId(null);
      setTitle('');
      setContent('');
    }
  }, [noteId, activeNote, setActiveNoteId]);

  // Debounced save
  useEffect(() => {
    if (!activeNoteId) return;
    
    const timeoutId = setTimeout(async () => {
      if (title !== activeNote?.title || content !== activeNote?.content) {
        setIsSaving(true);
        try {
          const updated = await api.put(`/notes/${activeNoteId}`, {
            title,
            content,
            folder_id: activeNote?.folder_id,
            is_pinned: activeNote?.is_pinned,
            is_archived: activeNote?.is_archived,
            in_trash: activeNote?.in_trash
          });
          updateNote(activeNoteId, updated);
          setLastSaved(new Date());
        } catch (error) {
          console.error("Failed to save note:", error);
        } finally {
          setIsSaving(false);
        }
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(timeoutId);
  }, [title, content, activeNoteId, activeNote, updateNote]);

  const handleCreateNew = async () => {
    try {
      const newNote = await api.post('/notes', {
        title: 'Untitled Note',
        content: '',
        folder_id: null
      });
      addNote(newNote);
      window.history.pushState(null, '', `/app/notes/${newNote.id}`);
      setActiveNoteId(newNote.id);
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  if (!noteId || !activeNote) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-muted-foreground p-8">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <FileDown className="h-8 w-8 opacity-50" />
          </div>
          <h2 className="text-xl font-medium text-foreground mb-2">No Note Selected</h2>
          <p className="mb-6">Select a note from the sidebar or create a new one to get started.</p>
          <Button onClick={handleCreateNew}>Create New Note</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col max-w-4xl mx-auto w-full">
      {/* Editor Header */}
      <div className="flex items-center justify-between py-4 px-8 border-b">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{isSaving ? 'Saving...' : lastSaved ? `Saved at ${lastSaved.toLocaleTimeString()}` : ''}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              const updated = { is_pinned: !activeNote.is_pinned };
              updateNote(activeNote.id, updated);
              api.put(`/notes/${activeNote.id}`, { ...activeNote, ...updated });
            }}
          >
            <Star className={`h-4 w-4 ${activeNote.is_pinned ? 'fill-yellow-500 text-yellow-500' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto px-8 py-10">
        <Input 
          className="text-4xl font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto mb-8 bg-transparent"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        {/* Tiptap Editor wraps the content */}
        <TiptapEditor 
          initialContent={activeNote.content || ''} 
          onChange={(newContent) => setContent(newContent)}
        />
      </div>
    </div>
  );
}
