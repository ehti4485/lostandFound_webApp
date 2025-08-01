import { getItemById, resolveItem } from '@/lib/api';
import { Item, ItemStatus } from '@/lib/types';
import { notFound } from 'next/navigation';

interface ItemDetailPageProps {
  params: { id: string };
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  let item: Item | null = null;
  try {
    item = await getItemById(params.id);
  } catch (error) {
    console.error('Failed to fetch item:', error);
  }

  if (!item) {
    notFound();
  }

  const handleResolve = async () => {
    if (item) {
      try {
        await resolveItem(item._id);
        // Optionally, revalidate path or update UI
        console.log('Item marked as resolved');
        // For simplicity, refreshing the page to show updated status
        window.location.reload();
      } catch (error) {
        console.error('Failed to resolve item:', error);
        alert('Failed to resolve item. Please try again.');
      }
    }
  };

  // Placeholder for owner check - in a real app, this would involve authentication
  const isOwner = true; // For demonstration, assume user is always owner

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-8">Item Details</h1>

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
            {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button> */}
            <button
              onClick={handleResolve}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Mark as Resolved
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

