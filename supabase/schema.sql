-- User profiles (extends Supabase Auth users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Folder structure
CREATE TABLE folders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  parent_id BIGINT REFERENCES folders (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their folders" ON folders
  FOR ALL USING (auth.uid() = user_id);

-- Notes
CREATE TABLE notes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  folder_id BIGINT REFERENCES folders (id) ON DELETE CASCADE,
  title TEXT,
  content TEXT, -- rich content stored as HTML/Markdown
  is_pinned BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  in_trash BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their notes" ON notes
  FOR ALL USING (auth.uid() = user_id);

-- Tags
CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their tags" ON tags
  FOR ALL USING (auth.uid() = user_id);

-- Note_Tags (many-to-many)
CREATE TABLE note_tags (
  note_id BIGINT REFERENCES notes (id) ON DELETE CASCADE,
  tag_id BIGINT REFERENCES tags (id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;

-- Note_tags RLS requires joining with notes table to verify ownership
CREATE POLICY "Users manage their note_tags" ON note_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM notes
      WHERE notes.id = note_tags.note_id
      AND notes.user_id = auth.uid()
    )
  );

-- Favorites
CREATE TABLE favorites (
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  note_id BIGINT NOT NULL REFERENCES notes (id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, note_id)
);
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Attachments
CREATE TABLE attachments (
  id BIGSERIAL PRIMARY KEY,
  note_id BIGINT REFERENCES notes (id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their attachments" ON attachments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM notes
      WHERE notes.id = attachments.note_id
      AND notes.user_id = auth.uid()
    )
  );

-- Function to handle auto-updating updated_at on notes
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notes_modtime
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Trigger to automatically create a profile for a new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
