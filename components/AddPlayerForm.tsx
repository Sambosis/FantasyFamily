
import React, { useState } from 'react';

interface AddPlayerFormProps {
  onAddPlayer: (name: string) => void;
}

export const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ onAddPlayer }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPlayer(name);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-xl">➕</span>
        <label htmlFor="playerName" className="text-lg font-semibold text-cyan-300">
          Add New Player
        </label>
      </div>
      <div className="flex gap-3">
        <div className="relative flex-grow">
          <input
            id="playerName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter player name..."
            className="w-full bg-slate-900/50 border-2 border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-transparent focus:outline-none transition-all duration-200 placeholder-slate-500"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="text-slate-500">👤</span>
          </div>
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          disabled={!name.trim()}
        >
          Add Player
        </button>
      </div>
    </form>
  );
};
