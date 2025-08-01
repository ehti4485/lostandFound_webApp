import Link from 'next/link';
import ItemCard from './components/ItemCard';
import { getItems } from '@/lib/api';
import { Item, ItemStatus } from '@/lib/types';

export default async function Home() {
  let recentFoundItems: Item[] = [];
  try {
    recentFoundItems = await getItems({ status: ItemStatus.Found });
  } catch (error) {
    console.error('Failed to fetch recent found items:', error);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">Welcome to EchoFind</h1>
      <p className="text-xl text-center text-gray-600 mb-12">
        Your smart lost and found solution.
      </p>

      <div className="flex justify-center space-x-4 mb-12">
        <Link href="/items/new?status=lost">
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300">
            I Lost Something
          </button>
        </Link>
        <Link href="/items/new?status=found">
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300">
            I Found Something
          </button>
        </Link>
      </div>

      <h2 className="text-3xl font-semibold text-center my-8">Recently Found Items</h2>
      {recentFoundItems.length === 0 ? (
        <p className="text-center text-gray-500">No recently found items to display.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentFoundItems.map((item) => (
            <ItemCard
              key={item._id}
              id={item._id}
              title={item.title}
              description={item.description}
              location={item.location}
              date={item.date}
              imageUrl={item.imageUrl}
              status={item.status}
              category={item.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}

