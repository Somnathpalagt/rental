import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import ListingCard from './ListingCard';

interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  images: string[];
}

export default function SearchListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    setLoading(true);

    let query = supabase.from('listings').select('*');

    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (minPrice) {
      query = query.gte('price', Number(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price', Number(maxPrice));
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching listings:', error);
    } else {
      setListings(data);
    }

    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Search Listings</h2>

      {/* Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
        <input
          type="text"
          placeholder="Search by location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border p-2 rounded-md w-full"
          />
          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border p-2 rounded-md w-full"
          />
        </div>
      </div>

      <button
        onClick={fetchListings}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full"
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>

      {/* Display Listings */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.length === 0 ? (
          <p className="text-gray-600">No listings found.</p>
        ) : (
          listings.map((listing) => <ListingCard key={listing.id} post={listing} />)
        )}
      </div>
    </div>
  );
}
