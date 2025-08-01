import { Request, Response } from 'express';
import { Item, IItem, ItemStatus } from '../models/item.model';
import { findMatches } from '../services/matching.service';

// WHAT-IT-DOES: Handles creation of a new item (lost or found)
// HOW-TO-USE: POST /api/items with item details in request body
export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const newItem: IItem = new Item(req.body);
    await newItem.save();
    
    // Trigger matching service after saving the new item
    findMatches(newItem);

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// WHAT-IT-DOES: Retrieves a list of items, with optional filtering by status and category
// HOW-TO-USE: GET /api/items?status=Lost&category=Electronics
export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, category } = req.query;
    let query: any = {};

    if (status) {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }

    const items: IItem[] = await Item.find(query);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// WHAT-IT-DOES: Retrieves details of a single item by ID
// HOW-TO-USE: GET /api/items/:id
export const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const item: IItem | null = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// WHAT-IT-DOES: Marks an item as 'Resolved'
// HOW-TO-USE: PUT /api/items/resolve/:id
export const resolveItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item: IItem | null = await Item.findByIdAndUpdate(
      req.params.id,
      { status: ItemStatus.Resolved, isMatched: true },
      { new: true } // Return the updated document
    );

    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

