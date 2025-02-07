import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useLoadScript, InfoWindow } from '@react-google-maps/api';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

interface Listing {
  id: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
  price: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = { lat: 40.7128, lng: -74.006 }; // Default to New York

export default function MapSearch() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  });

  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    setLoading(true);
    const { data, error } = await supabase.from('listings').select('id, title, location, lat, lng, price');
    if (error) {
      toast.error('Error loading listings');
    } else {
      setListings(data);
    }
    setLoading(false);
  }

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Search Listings on Map</h2>

      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={defaultCenter}>
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={{ lat: listing.lat, lng: listing.lng }}
            onClick={() => setSelectedListing(listing)}
          />
        ))}

        {selectedListing && (
          <InfoWindow
            position={{ lat: selectedListing.lat, lng: selectedListing.lng }}
            onCloseClick={() => setSelectedListing(null)}
          >
            <div>
              <h3 className="font-bold">{selectedListing.title}</h3>
              <p className="text-gray-600">{selectedListing.location}</p>
              <p className="text-gray-700 font-semibold">${selectedListing.price}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {loading && <p className="text-gray-600 mt-4">Loading listings...</p>}
    </div>
  );
}
