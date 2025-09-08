
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
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center justify-center w-6 h-6 bg-cyan-500/20 text-cyan-400 text-sm font-bold rounded-full">1</span>
        <label htmlFor="playerName" className="text-sm font-medium text-slate-300">
          Add New Player
        </label>
      </div>
      <div className="flex gap-3">
        <div className="flex-grow">
          <input
            id="playerName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Team Mom"
            className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all duration-200 placeholder-slate-400"
          />
        </div>
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-cyan-500/25"
          disabled={!name.trim()}
        >
          <span>+</span>
          Add
        </button>
      </div>
    </form>
  );
};
