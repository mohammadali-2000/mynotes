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
  
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const { name } = req.body;
  const supabase = getUserClient(req.token!);
  
  const { data, error } = await supabase
    .from('tags')
    .insert([{ user_id: req.user.id, name }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const supabase = getUserClient(req.token!);
  
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

export default router;
