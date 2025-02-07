import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Notifications from './Notifications';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center relative">
      {/* Logo */}
      <Link to="/" className="text-lg font-bold">
        Rental Listings
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/profile" className="hover:underline">
          Profile
        </Link>
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/auth" className="hover:underline">
          Login
        </Link>
        <Notifications />
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden flex items-center"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          ref={menuRef}
          className="absolute top-16 left-0 w-full bg-blue-700 p-4 flex flex-col space-y-4 md:hidden z-50"
        >
          <Link to="/profile" className="hover:underline" onClick={() => setIsMobileMenuOpen(false)}>
            Profile
          </Link>
          <Link to="/dashboard" className="hover:underline" onClick={() => setIsMobileMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/auth" className="hover:underline" onClick={() => setIsMobileMenuOpen(false)}>
            Login
          </Link>
          <Notifications />
        </div>
      )}
    </nav>
  );
}
