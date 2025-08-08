'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getItemById, resolveItem, getItems } from '@/lib/api';
import { Item, ItemStatus } from '@/lib/types';
import ItemCard from '@/app/components/ItemCard';

interface ItemDetailPageProps {
  params: { id: string };
}

export default function ItemDetailPage({ params }: ItemDetailPageProps) {
  const [item, setItem] = useState<Item | null>(null);
  const [similarItems, setSimilarItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchItem();
  }, [params.id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const itemData = await getItemById(params.id);
      setItem(itemData);
      setError(null);
      
      // Fetch similar items
      await fetchSimilarItems(itemData);
    } catch (err) {
      console.error('Failed to fetch item:', err);
      setError('Failed to load item details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarItems = async (itemData: Item) => {
    try {
      // Fetch all items to perform client-side matching
      const allItems = await getItems();
      
      // Filter items by same category and partial match on title
      const matches = allItems.filter(otherItem =>
        otherItem._id !== itemData._id && // Exclude the current item
        otherItem.category === itemData.category && // Same category
        (otherItem.title.toLowerCase().includes(itemData.title.toLowerCase()) ||
         itemData.title.toLowerCase().includes(otherItem.title.toLowerCase())) // Partial match on title
      );
      
      setSimilarItems(matches);
    } catch (err) {
      console.error('Failed to fetch similar items:', err);
    }
  };

  const handleResolve = async () => {
    if (item) {
      try {
        const updatedItem = await resolveItem(item._id);
        setItem(updatedItem);
        setAlert({ type: 'success', message: 'Item marked as resolved successfully!' });
        setTimeout(() => setAlert(null), 5000);
      } catch (error) {
        console.error('Failed to resolve item:', error);
        setAlert({ type: 'error', message: 'Failed to resolve item. Please try again.' });
        setTimeout(() => setAlert(null), 5000);
      }
    }
  };

  // Placeholder for owner check - in a real app, this would involve authentication
  const isOwner = true; // For demonstration, assume user is always owner

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-8">Item Details</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-8">Item Details</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-8">Item Not Found</h1>
        <div className="text-center">
          <p className="text-gray-600">The item you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push('/items')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Browse All Items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-8">Item Details</h1>
      
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

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.title} className="w-full h-64 object-cover rounded-md mb-6" />
        )}

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{item.title}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${item.status === ItemStatus.Lost ? 'bg-red-500' : 'bg-green-500'}`}>
          {item.status}
        </span>

        <p className="text-gray-700 mt-4 mb-4">{item.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 text-sm mb-6">
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Location:</strong> {item.location}</p>
          <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
          {item.uniqueIdentifier && <p><strong>Identifier:</strong> {item.uniqueIdentifier}</p>}
          <p><strong>Owner Email:</strong> {item.ownerEmail}</p>
          <p><strong>Posted On:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
        </div>

        {item.isMatched && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
            <p className="font-bold">Possible Match Found!</p>
            <p>The backend has suggested a potential match for this item. Please check your email for details.</p>
            {/* In a real application, this would link to the matched item or a communication portal */}
          </div>
        )}

        {isOwner && item.status !== ItemStatus.Resolved && (
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => router.push(`/items/${item._id}/edit`)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleResolve}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Mark as Resolved
            </button>
          </div>
        )}
      </div>
      
      {/* Similar Items Section */}
      {similarItems.length > 0 && (
        <div className="max-w-2xl mx-auto mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Similar Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {similarItems.map((similarItem) => (
              <ItemCard
                key={similarItem._id}
                id={similarItem._id}
                title={similarItem.title}
                description={similarItem.description}
                location={similarItem.location}
                date={similarItem.date}
                imageUrl={similarItem.imageUrl}
                status={similarItem.status}
                category={similarItem.category}
                ownerEmail={similarItem.ownerEmail}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

