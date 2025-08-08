import { Router } from 'express';
import { createItem, getItems, getItemById, updateItem, deleteItem, getMyItems, resolveItem } from '../controllers/item.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.route('/').post(protect, createItem).get(getItems);
router.route('/mine').get(protect, getMyItems);
router.route('/resolve/:id').put(protect, resolveItem);
router.route('/:id').get(getItemById).put(protect, updateItem).delete(protect, deleteItem);

export default router;


