import React from 'react';
import SearchListings from '../components/SearchListings';
import PremiumListings from '../components/PremiumListings';
import MapSearch from '../components/MapSearch';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Find Your Perfect Home</h1>

      <PremiumListings />

      <div className="mt-8">
        <SearchListings />
      </div>

      <div className="mt-8">
        <MapSearch />
      </div>
    </div>
  );
}
