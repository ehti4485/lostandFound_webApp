'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ItemCard from '../components/ItemCard';
import { Item, ItemStatus, ItemCategory } from '@/lib/types';
import { getMyItems, deleteItem } from '@/lib/api';

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    fetchMyItems();
  }, [router]);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      const itemsData = await getMyItems();
      setItems(itemsData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch items:', err);
      setError('Failed to load your items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    try {
      await deleteItem(id);
      setItems(items.filter(item => item._id !== id));
      setAlert({ type: 'success', message: 'Item deleted successfully!' });
      setTimeout(() => setAlert(null), 5000);
    } catch (err) {
      console.error('Failed to delete item:', err);
      setAlert({ type: 'error', message: 'Failed to delete item. Please try again.' });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/items/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-8">My Dashboard</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-8">My Dashboard</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-8">My Dashboard</h1>
      
      {/* Alert System */}
      {alert && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg transition-opacity duration-300 ${
          alert.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <span className="block sm:inline">{alert.message}</span>
          <button 
            onClick={() => setAlert(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">My Items</h2>
        <button
          onClick={() => router.push('/items/new')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Post New Item
        </button>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You haven't posted any items yet.</p>
          <button
            onClick={() => router.push('/items/new')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Post Your First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="relative">
              <ItemCard
                id={item._id}
                title={item.title}
                description={item.description}
                location={item.location}
                date={item.date}
                imageUrl={item.imageUrl}
                status={item.status}
                category={item.category}
                ownerEmail={item.ownerEmail}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(item._id)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}