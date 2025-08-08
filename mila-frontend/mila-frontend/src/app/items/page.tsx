'use client';

import { useState, useEffect, useMemo } from 'react';
import ItemCard from '../components/ItemCard';
import { getItems } from '@/lib/api';
import { Item, ItemStatus, ItemCategory } from '@/lib/types';

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ItemStatus | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | 'All'>('All');

  // Fetch items with filters and search (debounced)
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        // Prepare filter object for API call (server-side filters)
        const filters: { status?: ItemStatus; category?: ItemCategory; search?: string } = {};
        if (statusFilter !== 'All') {
          filters.status = statusFilter;
        }
        if (categoryFilter !== 'All') {
          filters.category = categoryFilter;
        }
        if (searchQuery) {
          filters.search = searchQuery;
        }
        
        const itemsData = await getItems(filters);
        setItems(itemsData);
        setFilteredItems(itemsData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch items:', err);
        setError('Failed to load items. Please try again later.');
        setLoading(false);
      }
    };

    // Debounce API calls by 300ms
    const debounceTimer = setTimeout(fetchItems, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [statusFilter, categoryFilter, searchQuery]);

  // Apply filters when searchQuery, statusFilter, or categoryFilter change
  useEffect(() => {
    let result = items;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(item => item.status === statusFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== 'All') {
      result = result.filter(item => item.category === categoryFilter);
    }
    
    setFilteredItems(result);
  }, [searchQuery, statusFilter, categoryFilter, items]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCategoryFilter('All');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-8">All Items</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-8">All Items</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-8">All Items</h1>
      
      {/* Search and Filters Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Items
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by title, description, or location..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ItemStatus | 'All')}
            >
              <option value="All">All Statuses</option>
              <option value={ItemStatus.Lost}>Lost</option>
              <option value={ItemStatus.Found}>Found</option>
              <option value={ItemStatus.Resolved}>Resolved</option>
            </select>
          </div>
          
          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ItemCategory | 'All')}
            >
              <option value="All">All Categories</option>
              {Object.values(ItemCategory).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Reset Filters Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset Filters
          </button>
        </div>
      </div>
      
      {/* Results Summary */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredItems.length} of {items.length} items
        </p>
      </div>
      
      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No items found matching your criteria.</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
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
              ownerEmail={item.ownerEmail}
            />
          ))}
        </div>
      )}
    </div>
  );
}