import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { createClient } from '@supabase/supabase-js';

const router = Router();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || ''; 

const getUserClient = (token: string) => {
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};

router.use(requireAuth);

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  const supabase = getUserClient(req.token!);
  const { folder_id, is_pinned, is_archived, in_trash, q } = req.query;

  let query = supabase.from('notes').select('*, tags(id, name)');

  if (folder_id) query = query.eq('folder_id', folder_id);
  if (is_pinned) query = query.eq('is_pinned', is_pinned === 'true');
  if (is_archived) query = query.eq('is_archived', is_archived === 'true');
  if (in_trash) query = query.eq('in_trash', in_trash === 'true');
  else query = query.eq('in_trash', false);

  if (q) {
    query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`);
  }

  const { data, error } = await query.order('updated_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const supabase = getUserClient(req.token!);
  const { data, error } = await supabase
    .from('notes')
    .select('*, tags(id, name)')
    .eq('id', id)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const { title, content, folder_id, tags } = req.body;
  const supabase = getUserClient(req.token!);
  
  const { data, error } = await supabase
    .from('notes')
    .insert([{ user_id: req.user.id, title, content, folder_id }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  
  // Handle tags if provided
  if (tags && tags.length > 0 && data) {
    const note_tags = tags.map((tag_id: number) => ({ note_id: data.id, tag_id }));
    await supabase.from('note_tags').insert(note_tags);
  }

  res.status(201).json(data);
});

router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, content, folder_id, is_pinned, is_archived, in_trash } = req.body;
  const supabase = getUserClient(req.token!);
  
  const { data, error } = await supabase
    .from('notes')
    .update({ title, content, folder_id, is_pinned, is_archived, in_trash })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const supabase = getUserClient(req.token!);
  
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

export default router;
