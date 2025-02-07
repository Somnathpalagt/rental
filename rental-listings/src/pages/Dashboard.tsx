import React from 'react';
import { Link } from 'react-router-dom';
import Inbox from '../components/Inbox';
import CreateListing from '../components/CreateListing';

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white shadow-md rounded-md">
          <h2 className="text-xl font-semibold mb-4">Your Messages</h2>
          <Inbox />
        </div>

        <div className="p-4 bg-white shadow-md rounded-md">
          <h2 className="text-xl font-semibold mb-4">Create a Listing</h2>
          <CreateListing />
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link to="/profile" className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
