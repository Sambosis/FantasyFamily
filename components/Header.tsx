
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center animate-fade-in">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          Fantasy Family
        </span>
      </h1>
      <p className="mt-2 text-lg text-slate-400">Where family drama becomes a competitive sport.</p>
    </header>
  );
};
