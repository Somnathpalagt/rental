import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  listingId: string;
  onReviewAdded: () => void;
}

export default function ReviewForm({ listingId, onReviewAdded }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return toast.error('Please enter a comment.');
    
    setLoading(true);
    const { data: user } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to submit a review.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('reviews').insert({
      listing_id: listingId,
      user_id: user.id,
      rating,
      comment,
    });

    if (error) {
      toast.error('Failed to submit review.');
    } else {
      toast.success('Review submitted!');
      setComment('');
      setRating(5);
      onReviewAdded();
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h3 className="text-lg font-semibold">Write a Review</h3>

      <label className="block text-sm font-medium mt-2">Rating (1-5):</label>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border p-2 rounded-md w-full"
        required
      />

      <label className="block text-sm font-medium mt-2">Comment:</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="border p-2 rounded-md w-full"
        rows={3}
        required
      ></textarea>

      <button
        type="submit"
        disabled={loading}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
