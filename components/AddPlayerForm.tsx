
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="playerName" className="block text-sm font-medium text-slate-300">
        1. Add New Player
      </label>
      <div className="flex gap-2">
        <input
          id="playerName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Team Mom"
          className="flex-grow bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
        />
        <button
          type="submit"
          className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
          disabled={!name.trim()}
        >
          Add
        </button>
      </div>
    </form>
  );
};
