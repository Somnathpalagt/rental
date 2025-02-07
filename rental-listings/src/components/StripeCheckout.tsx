import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';

const stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY');

interface StripeCheckoutProps {
  listingId: string;
}

export default function StripeCheckout({ listingId }: StripeCheckoutProps) {
  async function handlePayment() {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .single();

    if (error || !data) return alert('Listing not found');

    const stripe = await stripePromise;
    if (!stripe) return;

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId }),
    });

    const { sessionId } = await response.json();
    stripe.redirectToCheckout({ sessionId });
  }

  return (
    <button
      onClick={handlePayment}
      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
    >
      Upgrade to Premium ($10)
    </button>
  );
}
