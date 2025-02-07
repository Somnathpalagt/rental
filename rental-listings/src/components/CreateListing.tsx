import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

export default function CreateListing() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: user } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to create a listing');
      setLoading(false);
      return;
    }

    let imageUrls: string[] = [];
    for (const file of images) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not allowed. Only PNG, JPG, JPEG are accepted.`);
        setLoading(false);
        return;
      }

      const filePath = `listings/${user.id}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from('listing-images').upload(filePath, file);
      if (error) {
        toast.error(`Failed to upload ${file.name}`);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = await supabase.storage.from('listing-images').getPublicUrl(filePath);
      imageUrls.push(publicUrlData.publicUrl);
    }

    const { error } = await supabase.from('listings').insert({
      title,
      location,
      price,
      description,
      images: imageUrls,
      posted_by: user.id,
    });

    if (error) {
      toast.error('Failed to create listing');
    } else {
      toast.success('Listing created successfully!');
      setTitle('');
      setLocation('');
      setPrice('');
      setDescription('');
      setImages([]);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold">Create a Listing</h2>

      <label className="block text-sm font-medium text-gray-700">Title</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 w-full" required />

      <label className="block text-sm font-medium text-gray-700">Location</label>
      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="border p-2 w-full" required />

      <label className="block text-sm font-medium text-gray-700">Price ($)</label>
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 w-full" required />

      <label className="block text-sm font-medium text-gray-700">Description</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full" rows={4} required />

      <label className="block text-sm font-medium text-gray-700">Upload Images</label>
      <input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files || []))} />

      <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-md w-full">
        {loading ? 'Creating...' : 'Create Listing'}
      </button>
    </form>
  );
}
