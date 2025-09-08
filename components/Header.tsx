
import React from 'react';

interface HeaderProps {
  isCommissionerView: boolean;
  onToggleView: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isCommissionerView, onToggleView }) => {
  return (
    <header className="animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            Fantasy Family
          </span>
        </h1>
        <p className="mt-2 text-lg text-slate-400">Where family drama becomes a competitive sport.</p>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={onToggleView}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
            isCommissionerView 
              ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800' 
              : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600'
          }`}
        >
          <span className="flex items-center space-x-2">
            <span>{isCommissionerView ? '🏠' : '⚙️'}</span>
            <span>{isCommissionerView ? 'Back to Main View' : 'Commissioner View'}</span>
          </span>
        </button>
      </div>
    </header>
  );
};
