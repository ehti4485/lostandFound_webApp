import { Request, Response } from 'express';
import { Item, ItemStatus } from '../models/item.model';
import { findMatches } from '../services/matching.service';

interface AuthRequest extends Request {
  userId?: string;
}

export const createItem = async (req: AuthRequest, res: Response) => {
  try {
    console.log('DEBUG: createItem called');
    console.log('DEBUG: Request body:', req.body);
    console.log('DEBUG: Request headers:', req.headers);
    console.log('DEBUG: Request userId:', req.userId);
    
    const { title, description, category, status, location, imageUrl, uniqueIdentifier, ownerEmail } = req.body;
    const userId = req.userId; // Get userId from authenticated request

    if (!userId) {
      console.log('DEBUG: No userId found, returning 401');
      return res.status(401).json({ message: 'Not authorized, user ID missing' });
    }

    console.log('DEBUG: Creating new item with data:', {
      title, description, category, status, location, imageUrl, uniqueIdentifier, ownerEmail, owner: userId
    });

    const newItem = new Item({
      title,
      description,
      category,
      status,
      location,
      imageUrl,
      uniqueIdentifier,
      ownerEmail,
      owner: userId, // Associate item with the user
    });

    await newItem.save();
    console.log('DEBUG: Item saved successfully:', newItem);
    res.status(201).json(newItem);

    // Trigger matching service
    findMatches(newItem);
  } catch (error: any) {
    console.error('DEBUG: Error creating item:', error);
    console.error('DEBUG: Error message:', error.message);
    console.error('DEBUG: Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getItems = async (req: Request, res: Response) => {
  try {
    // Extract query parameters
    const { status, category, search } = req.query;
    
    // Build filter object
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (category) {
      filter.category = category;
    }
    
    // Add text search if provided
    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex }
      ];
    }
    
    const items = await Item.find(filter).populate('owner', 'username email'); // Populate owner details
    res.status(200).json(items);
  } catch (error: any) {
    console.error('Error fetching items:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getItemById = async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'username email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error: any) {
    console.error('Error fetching item by ID:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateItem = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, status, location, imageUrl, uniqueIdentifier, isMatched, ownerEmail } = req.body;
    const userId = req.userId;

    let item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Ensure only the owner can update the item
    if (item.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    item.title = title || item.title;
    item.description = description || item.description;
    item.category = category || item.category;
    item.status = status || item.status;
    item.location = location || item.location;
    item.imageUrl = imageUrl || item.imageUrl;
    item.uniqueIdentifier = uniqueIdentifier || item.uniqueIdentifier;
    item.ownerEmail = ownerEmail || item.ownerEmail;
    item.isMatched = isMatched !== undefined ? isMatched : item.isMatched;

    await item.save();
    res.status(200).json(item);
  } catch (error: any) {
    console.error('Error updating item:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Ensure only the owner can delete the item
    if (item.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();
    res.status(200).json({ message: 'Item removed' });
  } catch (error: any) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// WHAT-IT-DOES: Fetches items created by the current user
// HOW-TO-USE: Called when user visits their dashboard
export const getMyItems = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized, user ID missing' });
    }

    const items = await Item.find({ owner: userId }).populate('owner', 'username email');
    res.status(200).json(items);
  } catch (error: any) {
    console.error('Error fetching user items:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// WHAT-IT-DOES: Marks an item as resolved
// HOW-TO-USE: Called when user marks an item as resolved
export const resolveItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized, user ID missing' });
    }

    let item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Ensure only the owner can resolve the item
    if (item.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to resolve this item' });
    }

    item.status = ItemStatus.Resolved;
    await item.save();
    res.status(200).json(item);
  } catch (error: any) {
    console.error('Error resolving item:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

