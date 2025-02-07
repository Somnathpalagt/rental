import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import type { RoommatePost } from '../types';

interface ListingCardProps {
  post: RoommatePost;
}

export default function ListingCard({ post }: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % post.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + post.images.length) % post.images.length);
  };

  async function handleDelete() {
    const confirmDelete = window.confirm('Are you sure you want to delete this listing?');
    if (!confirmDelete) return;

    const { error } = await supabase.from('listings').delete().eq('id', post.id);
    if (error) {
      alert('Failed to delete listing');
    } else {
      alert('Listing deleted successfully');
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>

      {/* Image Gallery */}
      {post.images.length > 0 && (
        <div className="relative">
          <img
            src={post.images[currentImageIndex]}
            alt="Listing"
            className="w-full h-64 object-cover rounded-md"
          />
          {post.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-2 bg-gray-700 text-white px-2 py-1 rounded"
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-2 bg-gray-700 text-white px-2 py-1 rounded"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}

      <p className="text-gray-700 mt-2">{post.description}</p>
      <p className="text-gray-600 mt-1">Location: {post.location}</p>
      <p className="text-gray-600 mt-1">Price: ${post.price}</p>

      <div className="flex justify-between items-center mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Contact Owner
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
