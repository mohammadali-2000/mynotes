"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const supabase_js_1 = require("@supabase/supabase-js");
const router = (0, express_1.Router)();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const getUserClient = (token) => {
    return (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });
};
router.use(auth_1.requireAuth);
router.get('/', async (req, res) => {
    const supabase = getUserClient(req.token);
    const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true });
    if (error)
        return res.status(400).json({ error: error.message });
    res.json(data);
});
router.post('/', async (req, res) => {
    const { name } = req.body;
    const supabase = getUserClient(req.token);
    const { data, error } = await supabase
        .from('tags')
        .insert([{ user_id: req.user.id, name }])
        .select()
        .single();
    if (error)
        return res.status(400).json({ error: error.message });
    res.status(201).json(data);
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const supabase = getUserClient(req.token);
    const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);
    if (error)
        return res.status(400).json({ error: error.message });
    res.status(204).send();
});
exports.default = router;
//# sourceMappingURL=tags.js.map