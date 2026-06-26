import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { createClient } from '@supabase/supabase-js';

const router = Router();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || ''; // Must be service role key or anon

// Helper to create a user-scoped supabase client using their token
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
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .order('position', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const { name, parent_id, position } = req.body;
  const supabase = getUserClient(req.token!);
  const { data, error } = await supabase
    .from('folders')
    .insert([{ user_id: req.user.id, name, parent_id, position }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, parent_id, position } = req.body;
  const supabase = getUserClient(req.token!);
  const { data, error } = await supabase
    .from('folders')
    .update({ name, parent_id, position })
    .eq('id', id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const supabase = getUserClient(req.token!);
  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

export default router;
