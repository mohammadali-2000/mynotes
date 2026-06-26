import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '@/store/workspaceStore';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileDown, Trash } from 'lucide-react';

export default function NotesWorkspace() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { notes, activeNoteId, setActiveNoteId, updateNote, addNote, deleteNote } = useWorkspaceStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const activeNote = notes.find(n => n.id === Number(noteId)) || notes.find(n => n.id === activeNoteId);

  useEffect(() => {
    if (noteId && activeNote) {
      setActiveNoteId(Number(noteId));
      setTitle(activeNote.title || '');
      setContent(activeNote.content || '');
    } else if (!noteId && activeNote) {
      navigate(`/app/notes/${activeNote.id}`);
    } else if (!noteId && !activeNote) {
      setActiveNoteId(null);
      setTitle('');
      setContent('');
    }
  }, [noteId, activeNote, setActiveNoteId, navigate]);

  // Save changes locally
  useEffect(() => {
    if (!activeNote) return;
    
    const timeoutId = setTimeout(() => {
      if (title !== activeNote.title || content !== activeNote.content) {
        updateNote(activeNote.id, {
          title,
          content,
        });
      }
    }, 1000); // 1 second debounce for local save

    return () => clearTimeout(timeoutId);
  }, [title, content, activeNote, updateNote]);

  const handleCreateNew = () => {
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

  const handleDelete = () => {
    if (activeNote) {
      deleteNote(activeNote.id);
      navigate('/app');
    }
  };

  if (!activeNote) {
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
      <div className="flex items-center justify-end py-4 px-8 border-b">
        <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:bg-destructive/10">
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto px-8 py-10">
        <Input 
          className="text-4xl font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto mb-8 bg-transparent"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <TiptapEditor 
          initialContent={activeNote.content || ''} 
          onChange={(newContent) => setContent(newContent)}
        />
      </div>
    </div>
  );
}
