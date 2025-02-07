import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-10">
      &copy; {new Date().getFullYear()} Rental Listings. All rights reserved.
    </footer>
  );
}
