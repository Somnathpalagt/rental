import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

export default function Profile() {
  const [profile, setProfile] = useState({ full_name: '', phone: '', avatar_url: '', two_factor_enabled: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    const { data: user } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      toast.error('Error loading profile');
    } else {
      setProfile(data);
    }
    setLoading(false);
  }

  async function updateProfile() {
    setLoading(true);
    const { data: user } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('profiles').update(profile).eq('id', user.id);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated!');
    }
    setLoading(false);
  }

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG and PNG images are allowed.');
      return;
    }

    const filePath = `avatars/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('avatars').upload(filePath, file);

    if (error) {
      toast.error('Failed to upload image');
    } else {
      const { data: publicUrlData } = await supabase.storage.from('avatars').getPublicUrl(filePath);
      setProfile({ ...profile, avatar_url: publicUrlData.publicUrl });
      toast.success('Profile picture updated!');
    }
  }

  async function toggle2FA() {
    setProfile({ ...profile, two_factor_enabled: !profile.two_factor_enabled });

    const { data: user } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('profiles')
      .update({ two_factor_enabled: !profile.two_factor_enabled })
      .eq('id', user.id);

    toast.success(profile.two_factor_enabled ? '2FA Disabled' : '2FA Enabled');
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      <div className="flex flex-col items-center">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-3"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-3" />
        )}
        <input type="file" accept="image/*" onChange={handleAvatarUpload} />
      </div>

      <label className="block text-sm font-medium text-gray-700 mt-4">Full Name</label>
      <input
        type="text"
        value={profile.full_name}
        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />

      <label className="block text-sm font-medium text-gray-700 mt-4">Phone</label>
      <input
        type="text"
        value={profile.phone}
        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />

      <div className="mt-4 flex justify-between items-center">
        <span className="text-gray-700">Two-Factor Authentication (2FA)</span>
        <button
          onClick={toggle2FA}
          className={`px-4 py-2 rounded-md ${profile.two_factor_enabled ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
        >
          {profile.two_factor_enabled ? 'Disable' : 'Enable'}
        </button>
      </div>

      <button
        onClick={updateProfile}
        disabled={loading}
        className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Update Profile'}
      </button>
    </div>
  );
}
