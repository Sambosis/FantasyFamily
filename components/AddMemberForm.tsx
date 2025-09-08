
import React, { useState } from 'react';
import { Player } from '../types';

interface AddMemberFormProps {
  players: Player[];
  onAddMember: (playerId: string, memberName: string) => void;
}

export const AddMemberForm: React.FC<AddMemberFormProps> = ({ players, onAddMember }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [memberName, setMemberName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMember(selectedPlayer, memberName);
    setSelectedPlayer('');
    setMemberName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center justify-center w-6 h-6 bg-purple-500/20 text-purple-400 text-sm font-bold rounded-full">2</span>
        <label htmlFor="playerSelect" className="text-sm font-medium text-slate-300">
          Draft Family Member
        </label>
      </div>
      <div className="space-y-3">
        <div className="relative">
          <select
            id="playerSelect"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">Select a Player...</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <span className="text-slate-400">▼</span>
          </div>
        </div>
        <input
          type="text"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
          placeholder="e.g., Uncle Bob"
          className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-200 placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedPlayer}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25"
        disabled={!selectedPlayer || !memberName.trim()}
      >
        <span>👨‍👩‍👧‍👦</span>
        Draft Member
      </button>
    </form>
  );
};
