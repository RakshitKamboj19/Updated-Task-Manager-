import React from 'react';

const Loader = ({ Dark, setDark, size = 'w-8 h-8' }) => {
  const loaderColor = Dark ? 'border-white' : 'border-indigo-600'; // Dynamic loader color based on theme

  return (
    <>
      <div className={`my-8 mx-auto ${size}`} aria-live="assertive">
        <div
          className={`w-full h-full rounded-full border-[3px] ${loaderColor} border-b-transparent animate-loader`}
        ></div>
      </div>
    </>
  );
};

export default Loader;
