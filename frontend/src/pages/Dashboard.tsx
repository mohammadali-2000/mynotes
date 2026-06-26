import { useWorkspaceStore } from '@/store/workspaceStore';
import { useAuthStore } from '@/store/authStore';
import { FileText, Folder, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function Dashboard() {
  const { notes, folders } = useWorkspaceStore();
  const { user } = useAuthStore();

  const recentNotes = [...notes].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 5);
  const favoriteNotes = notes.filter(n => n.is_pinned); // Treating pinned as favorite for now

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Good morning, {user?.user_metadata?.full_name?.split(' ')[0] || 'there'}!</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your second brain.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Notes</p>
            <h2 className="text-3xl font-bold">{notes.length}</h2>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Folder className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Folders</p>
            <h2 className="text-3xl font-bold">{folders.length}</h2>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Favorites</p>
            <h2 className="text-3xl font-bold">{favoriteNotes.length}</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Recently Edited</h2>
          </div>
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            {recentNotes.length > 0 ? (
              <ul className="divide-y divide-border">
                {recentNotes.map(note => (
                  <li key={note.id}>
                    <Link to={`/app/notes/${note.id}`} className="block p-4 hover:bg-muted/50 transition-colors">
                      <h3 className="font-medium">{note.title || 'Untitled Note'}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Edited {format(new Date(note.updated_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p>No recent notes found.</p>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Favorites</h2>
          </div>
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            {favoriteNotes.length > 0 ? (
              <ul className="divide-y divide-border">
                {favoriteNotes.map(note => (
                  <li key={note.id}>
                    <Link to={`/app/notes/${note.id}`} className="block p-4 hover:bg-muted/50 transition-colors">
                      <h3 className="font-medium">{note.title || 'Untitled Note'}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created {format(new Date(note.created_at), 'MMM d, yyyy')}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p>No favorite notes yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
