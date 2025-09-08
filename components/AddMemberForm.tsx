
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
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-xl">🎯</span>
        <label htmlFor="playerSelect" className="text-lg font-semibold text-purple-300">
          Draft Family Member
        </label>
      </div>
      <div className="space-y-3">
        <div className="relative">
          <select
            id="playerSelect"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="w-full bg-slate-900/50 border-2 border-slate-600 text-white rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">Select a Player...</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="text-slate-400">▼</span>
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            placeholder="Enter family member name..."
            className="w-full bg-slate-900/50 border-2 border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:outline-none transition-all duration-200 placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedPlayer}
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="text-slate-500">👥</span>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
        disabled={!selectedPlayer || !memberName.trim()}
      >
        <span className="flex items-center justify-center space-x-2">
          <span>🚀</span>
          <span>Draft Member</span>
        </span>
      </button>
    </form>
  );
};
