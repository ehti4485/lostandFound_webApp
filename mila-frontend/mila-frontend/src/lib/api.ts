import { Item, ItemStatus, ItemCategory } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// WHAT-IT-DOES: Fetches all items with optional filtering
// HOW-TO-USE: getItems() or getItems({ status: ItemStatus.Lost, category: ItemCategory.Electronics, search: 'phone' })
export async function getItems(filters?: { status?: ItemStatus; category?: ItemCategory; search?: string }): Promise<Item[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  
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
  console.log('DEBUG: Attempting to create item with data:', itemData);
  console.log('DEBUG: API_BASE_URL:', API_BASE_URL);
  
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(itemData),
  });
  
  console.log('DEBUG: Response status:', response.status);
  console.log('DEBUG: Response ok:', response.ok);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.log('DEBUG: Error response:', errorText);
    throw new Error(`Failed to create item: ${response.status} - ${errorText}`);
  }
  return response.json();
}

// WHAT-IT-DOES: Marks an item as resolved
// HOW-TO-USE: resolveItem('64f1a2b3c4d5e6f7g8h9i0j1')
export async function resolveItem(id: string): Promise<Item> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_BASE_URL}/items/resolve/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to resolve item');
  }
  return response.json();
}

// WHAT-IT-DOES: Fetches items created by the current user
// HOW-TO-USE: getMyItems()
export async function getMyItems(): Promise<Item[]> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_BASE_URL}/items/mine`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch your items');
  }
  return response.json();
}

// WHAT-IT-DOES: Deletes an item by ID
// HOW-TO-USE: deleteItem('64f1a2b3c4d5e6f7g8h9i0j1')
export async function deleteItem(id: string): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete item');
  }
}

// WHAT-IT-DOES: Updates an item by ID
// HOW-TO-USE: updateItem('64f1a2b3c4d5e6f7g8h9i0j1', { title: 'Updated Title', ... })
export async function updateItem(id: string, itemData: Partial<Omit<Item, '_id' | 'createdAt' | 'updatedAt' | 'isMatched'>>): Promise<Item> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(itemData),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update item: ${response.status} - ${errorText}`);
  }
  return response.json();
}

// WHAT-IT-DOES: Signs up a new user
// HOW-TO-USE: signup({ name: 'John Doe', email: 'john@example.com', password: 'password123' })
export async function signup(userData: { name: string; email: string; password: string }): Promise<{ token: string; user: { id: string; name: string; email: string; createdAt: string } }> {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to signup');
  }

  return response.json();
}

// WHAT-IT-DOES: Logs in a user
// HOW-TO-USE: login({ email: 'john@example.com', password: 'password123' })
export async function login(credentials: { email: string; password: string }): Promise<{ token: string; user: { id: string; name: string; email: string; createdAt: string } }> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to login');
  }

  return response.json();
}

