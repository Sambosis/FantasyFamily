
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
          className="px-4 py-2 rounded-md font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
        >
          {isCommissionerView ? 'Back to Main View' : 'Go to Commissioner View'}
        </button>
      </div>
    </header>
  );
};
