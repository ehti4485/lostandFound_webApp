import { Item, ItemStatus, ItemCategory } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// WHAT-IT-DOES: Fetches all items with optional filtering
// HOW-TO-USE: getItems() or getItems({ status: ItemStatus.Lost, category: ItemCategory.Electronics })
export async function getItems(filters?: { status?: ItemStatus; category?: ItemCategory }): Promise<Item[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.category) params.append('category', filters.category);

  const response = await fetch(`${API_BASE_URL}/items?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch items');
  }
  return response.json();
}

// WHAT-IT-DOES: Fetches a single item by ID
// HOW-TO-USE: getItemById('64f1a2b3c4d5e6f7g8h9i0j1')
export async function getItemById(id: string): Promise<Item> {
  const response = await fetch(`${API_BASE_URL}/items/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch item');
  }
  return response.json();
}

// WHAT-IT-DOES: Creates a new item
// HOW-TO-USE: createItem({ title: 'Lost Phone', description: '...', ... })
export async function createItem(itemData: Omit<Item, '_id' | 'createdAt' | 'updatedAt' | 'isMatched'>): Promise<Item> {
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(itemData),
  });
  if (!response.ok) {
    throw new Error('Failed to create item');
  }
  return response.json();
}

// WHAT-IT-DOES: Marks an item as resolved
// HOW-TO-USE: resolveItem('64f1a2b3c4d5e6f7g8h9i0j1')
export async function resolveItem(id: string): Promise<Item> {
  const response = await fetch(`${API_BASE_URL}/items/resolve/${id}`, {
    method: 'PUT',
  });
  if (!response.ok) {
    throw new Error('Failed to resolve item');
  }
  return response.json();
}

