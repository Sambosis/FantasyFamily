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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-xl">✏️</span>
        <label htmlFor="renamePlayerSelect" className="text-lg font-semibold text-blue-300">
          Rename Player
        </label>
      </div>
      <div className="space-y-3">
        <div className="relative">
          <select
            id="renamePlayerSelect"
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            className="w-full bg-slate-900/50 border-2 border-slate-600 text-white rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">Select a Player to Rename...</option>
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
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new name..."
            className="w-full bg-slate-900/50 border-2 border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:outline-none transition-all duration-200 placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedPlayerId}
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="text-slate-500">🏷️</span>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-cyan-600 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
        disabled={!selectedPlayerId || !newName.trim()}
      >
        <span className="flex items-center justify-center space-x-2">
          <span>🔄</span>
          <span>Update Name</span>
        </span>
      </button>
    </form>
  );
};