import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

const stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY');

interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  is_premium: boolean;
}

export default function PremiumListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    setLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('is_premium', { ascending: false }) // Premium listings first
      .order('created_at', { ascending: false });

    if (!error) setListings(data);
    setLoading(false);
  }

  async function handleUpgrade(listingId: string) {
    const stripe = await stripePromise;
    if (!stripe) return toast.error('Stripe failed to load.');

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId }),
    });

    const { sessionId } = await response.json();
    stripe.redirectToCheckout({ sessionId });
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Premium Listings</h2>

      {loading ? (
        <p className="text-gray-600">Loading listings...</p>
      ) : listings.length === 0 ? (
        <p className="text-gray-600">No listings available.</p>
      ) : (
        listings.map((listing) => (
          <div key={listing.id} className={`p-4 border rounded-md mb-4 ${listing.is_premium ? 'border-yellow-500' : ''}`}>
            {listing.is_premium && <span className="text-yellow-500 font-bold">⭐ Premium</span>}
            <h3 className="text-lg font-semibold">{listing.title}</h3>
            <p className="text-gray-600">{listing.location}</p>
            <p className="text-gray-700 font-semibold">${listing.price}</p>

            {!listing.is_premium && (
              <button
                onClick={() => handleUpgrade(listing.id)}
                className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
              >
                Upgrade to Premium ($10)
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
