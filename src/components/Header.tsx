
import React from 'react';

export const Header = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
        Transformator
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Transform your raw bank CSV files into perfectly formatted data for your personal finance app
      </p>
    </div>
  );
};
