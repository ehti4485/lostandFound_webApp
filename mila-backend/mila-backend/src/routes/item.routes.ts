import { Router } from 'express';
import { createItem, getItems, getItemById, resolveItem } from '../controllers/item.controller';

const router = Router();

// WHAT-IT-DOES: Defines API routes for item operations
// HOW-TO-USE: These routes are prefixed with '/api' in app.ts

// POST /api/items - Create a new item post (for both lost and found)
router.post('/items', createItem);

// GET /api/items - Get a list of all items with optional filtering
router.get('/items', getItems);

// GET /api/items/:id - Get details of a single item
router.get('/items/:id', getItemById);

// PUT /api/items/resolve/:id - Mark an item as 'Resolved'
router.put('/items/resolve/:id', resolveItem);

export default router;
