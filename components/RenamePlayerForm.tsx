import React, { useState, useEffect } from 'react';
import { Player } from '../types';

interface RenamePlayerFormProps {
  players: Player[];
  onRenamePlayer: (playerId: string, newName: string) => void;
}

export const RenamePlayerForm: React.FC<RenamePlayerFormProps> = ({ players, onRenamePlayer }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const selectedPlayer = players.find(p => p.id === selectedPlayerId);
    if (selectedPlayer) {
      setNewName(selectedPlayer.name);
    } else {
      setNewName('');
    }
  }, [selectedPlayerId, players]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId || !newName.trim()) return;
    onRenamePlayer(selectedPlayerId, newName);
    setSelectedPlayerId('');
    setNewName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="renamePlayerSelect" className="block text-sm font-medium text-slate-300">
        5. Rename Player
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          id="renamePlayerSelect"
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
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new name"
          className="flex-grow bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          disabled={!selectedPlayerId}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        disabled={!selectedPlayerId || !newName.trim()}
      >
        Rename Player
      </button>
    </form>
  );
};

