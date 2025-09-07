import React, { useState } from 'react';
import { Player } from '../types';

interface DeletePlayerFormProps {
  players: Player[];
  onDeletePlayer: (playerId: string) => void;
}

export const DeletePlayerForm: React.FC<DeletePlayerFormProps> = ({ players, onDeletePlayer }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId) return;
    onDeletePlayer(selectedPlayerId);
    setSelectedPlayerId('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="deletePlayerSelect" className="block text-sm font-medium text-slate-300">
        4. Delete Player
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          id="deletePlayerSelect"
          value={selectedPlayerId}
          onChange={(e) => setSelectedPlayerId(e.target.value)}
          className="flex-grow bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
        >
          <option value="">Select a Player...</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        disabled={!selectedPlayerId}
      >
        Delete Player
      </button>
    </form>
  );
};