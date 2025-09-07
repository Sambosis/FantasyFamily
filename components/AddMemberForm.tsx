
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="playerSelect" className="block text-sm font-medium text-slate-300">
        2. Draft Family Member
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          id="playerSelect"
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value)}
          className="flex-grow bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
        >
          <option value="">Select a Player...</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
          placeholder="e.g., Uncle Bob"
          className="flex-grow bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          disabled={!selectedPlayer}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        disabled={!selectedPlayer || !memberName.trim()}
      >
        Draft Member
      </button>
    </form>
  );
};
