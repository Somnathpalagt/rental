import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Success from './pages/Success';
import Auth from './components/Auth';
import Profile from './components/Profile';
import Notifications from './components/Notifications';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4 text-center text-lg font-bold">
          Rental Listings
        </header>

        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </main>

        <footer className="bg-gray-800 text-white text-center p-4 mt-10">
          &copy; {new Date().getFullYear()} Rental Listings. All rights reserved.
        </footer>

        <div className="absolute top-4 right-4">
          <Notifications />
        </div>
      </div>
    </Router>
  );
}
