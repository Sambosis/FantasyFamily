
import React from 'react';

interface HeaderProps {
  isCommissionerView: boolean;
  onToggleView: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isCommissionerView, onToggleView }) => {
  return (
    <header className="text-center animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <div className="w-32"></div> {/* Spacer for centering */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            Fantasy Family
          </span>
        </h1>
        <div className="w-32 flex justify-end">
          <button
            onClick={onToggleView}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            {isCommissionerView ? '🏆 View Scores' : '⚙️ Commissioner'}
          </button>
        </div>
      </div>
      <p className="text-lg text-slate-400">
        {isCommissionerView 
          ? "Manage players, events, and keep the family drama organized." 
          : "Where family drama becomes a competitive sport."
        }
      </p>
    </header>
  );
};
