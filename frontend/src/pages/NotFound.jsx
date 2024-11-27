import React from 'react';
import MainLayout from '../layouts/MainLayout';

const NotFound = ({ Dark, setDark }) => {
  return (
    <MainLayout Dark={Dark} setDark={setDark}>
      {/* Page Content */}
      <div className={`w-full py-16 text-center ${Dark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
        <h1 className={`text-7xl my-8 ${Dark ? 'text-red-500' : 'text-red-700'}`}>404</h1>
        <h2 className={`text-xl ${Dark ? 'text-gray-300' : 'text-gray-800'}`}>
          The page you are looking for doesn't exist
        </h2>
      </div>
    </MainLayout>
  );
};

export default NotFound;