import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { formatDate } from '../utils/formatDate';
import ReviewForm from './ReviewForm';

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewsProps {
  listingId: string;
}

export default function Reviews({ listingId }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error.message);
    } else {
      setReviews(data);
    }
    setLoading(false);
  }

  return (
    <div className="mt-6 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Reviews</h2>

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id} className="p-3 border-b last:border-none">
              <p className="text-gray-800">⭐ {review.rating}/5</p>
              <p className="text-gray-700">{review.comment}</p>
              <p className="text-xs text-gray-500">Reviewed on {formatDate(review.created_at)}</p>
            </li>
          ))}
        </ul>
      )}

      <ReviewForm listingId={listingId} onReviewAdded={fetchReviews} />
    </div>
  );
}
