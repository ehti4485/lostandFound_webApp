'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createItem } from '@/lib/api';
import { ItemCategory, ItemStatus } from '@/lib/types';

export default function NewItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') === 'found' ? ItemStatus.Found : ItemStatus.Lost;

  const [status, setStatus] = useState<ItemStatus>(initialStatus);
  const [category, setCategory] = useState<ItemCategory>(ItemCategory.Electronics);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uniqueIdentifier, setUniqueIdentifier] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newItem = {
        status,
        category,
        title,
        description,
        location,
        date: new Date(date).toISOString(),
        imageUrl,
        uniqueIdentifier,
        ownerEmail,
      };
      await createItem(newItem);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-8">Post a New Item</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Item Status:</label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="status"
                value={ItemStatus.Lost}
                checked={status === ItemStatus.Lost}
                onChange={() => setStatus(ItemStatus.Lost)}
              />
              <span className="ml-2">Lost</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="status"
                value={ItemStatus.Found}
                checked={status === ItemStatus.Found}
                onChange={() => setStatus(ItemStatus.Found)}
              />
              <span className="ml-2">Found</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
          <select
            id="category"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={category}
            onChange={(e) => setCategory(e.target.value as ItemCategory)}
            required
          >
            {Object.values(ItemCategory).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
          <textarea
            id="description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Location (where it was lost/found):</label>
          <input
            type="text"
            id="location"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date (when it was lost/found):</label>
          <input
            type="date"
            id="date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Conditional fields based on category */}
        {(category === ItemCategory.Documents || category === ItemCategory.Electronics) && (
          <div className="mb-4">
            <label htmlFor="uniqueIdentifier" className="block text-gray-700 text-sm font-bold mb-2">
              {category === ItemCategory.Documents ? 'Document Number (Optional)' : 'IMEI/Serial Number (Optional)'}:
            </label>
            <input
              type="text"
              id="uniqueIdentifier"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={uniqueIdentifier}
              onChange={(e) => setUniqueIdentifier(e.target.value)}
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">Image URL (Optional):</label>
          <input
            type="url"
            id="imageUrl"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="e.g., https://example.com/item-image.jpg"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="ownerEmail" className="block text-gray-700 text-sm font-bold mb-2">Your Email:</label>
          <input
            type="email"
            id="ownerEmail"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Post Item'}
          </button>
        </div>
      </form>
    </div>
  );
}

