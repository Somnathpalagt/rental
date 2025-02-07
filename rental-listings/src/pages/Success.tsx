import React, { useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Success() {
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('listingId');

  useEffect(() => {
    if (listingId) {
      supabase
        .from('listings')
        .update({ is_premium: true })
        .eq('id', listingId)
        .then(() => toast.success('Listing upgraded to Premium!'));
    }
  }, [listingId]);

  return (
    <div className="text-center p-10">
      <h2 className="text-2xl font-bold">Payment Successful!</h2>
      <p>Your listing has been upgraded to Premium.</p>
    </div>
  );
}
