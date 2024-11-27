import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';

const MainLayout = ({ Dark, setDark, children }) => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDark(savedTheme === 'dark');
    }
  }, [setDark]);

  useEffect(() => {
    localStorage.setItem('theme', Dark ? 'dark' : 'light');
  }, [Dark]);

  return (
    <div
      className={`relative min-h-screen w-screen overflow-x-hidden ${Dark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}
    >
      <Navbar Dark={Dark} setDark={setDark} />
      <main className="overflow-y-auto">{children}</main> {/* Ensure vertical scrolling for longer content */}
    </div>
  );
};

export default MainLayout;
