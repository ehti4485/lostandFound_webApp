import Link from 'next/link';
import { ItemCategory, ItemStatus } from '@/lib/types';

interface ItemCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  imageUrl?: string;
  status: ItemStatus;
  category: ItemCategory;
  ownerEmail?: string;
}

const ItemCard: React.FC<ItemCardProps> = ({
  id,
  title,
  description,
  location,
  date,
  imageUrl,
  status,
  category,
  ownerEmail,
}) => {
  const statusColor = status === ItemStatus.Lost ? 'bg-red-500' : 'bg-green-500';

  return (
    <Link href={`/items/${id}`}>
      <div className="border rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300">
        {imageUrl && (
          <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        )}
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${statusColor}`}>
              {status}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
          <div className="text-gray-500 text-xs">
            <p><strong>Location:</strong> {location}</p>
            <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
            <p><strong>Category:</strong> {category}</p>
            {ownerEmail && <p><strong>Owner:</strong> {ownerEmail}</p>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;

