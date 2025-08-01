import { Router } from 'express';

const router = Router();

// Sample in-memory data store
let items: { id: number; name: string }[] = [];
let currentId = 1;

// Create an item
router.post('/items', (req, res) => {
    const { name } = req.body;
    const newItem = { id: currentId++, name };
    items.push(newItem);
    res.status(201).json(newItem);
});

// Read all items
router.get('/items', (req, res) => {
    res.json(items);
});

// Read a single item
router.get('/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (item) {
        res.json(item);
    } else {
        res.status(404).send('Item not found');
    }
});

// Update an item
router.put('/items/:id', (req, res) => {
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
    if (itemIndex !== -1) {
        const { name } = req.body;
        items[itemIndex].name = name;
        res.json(items[itemIndex]);
    } else {
        res.status(404).send('Item not found');
    }
});

// Delete an item
router.delete('/items/:id', (req, res) => {
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
    if (itemIndex !== -1) {
        items.splice(itemIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Item not found');
    }
});

export default router;