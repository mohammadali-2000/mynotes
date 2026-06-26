"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const express_1 = require("express");
const supabase_1 = require("../lib/supabase");
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }
        const token = authHeader.split(' ')[1];
        // Verify the JWT using Supabase
        const { data: { user }, error } = await supabase_1.supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        req.user = user;
        req.token = token;
        next();
    }
    catch (err) {
        console.error('Auth middleware error:', err);
        res.status(500).json({ error: 'Internal server error during authentication' });
    }
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=auth.js.map