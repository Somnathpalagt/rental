import React from 'react';
import { Link } from 'react-router-dom';
import Notifications from './Notifications';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-lg font-bold">Rental Listings</Link>

      <div className="flex items-center space-x-4">
        <Link to="/profile" className="hover:underline">Profile</Link>
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/auth" className="hover:underline">Login</Link>
        <Notifications />
      </div> 
    </nav>  
  );
}
