import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useLoadScript, InfoWindow } from '@react-google-maps/api';
import { supabase } from '../lib/supabase';

interface Listing {
  id: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = { lat: 40.7128, lng: -74.006 }; // Default to New York

export default function MapView() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  });

  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    const { data, error } = await supabase.from('listings').select('id, title, location, lat, lng');
    if (!error && data) setListings(data);
  }

  if (!isLoaded) return <p>Loading map...</p>;

  return (
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
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
